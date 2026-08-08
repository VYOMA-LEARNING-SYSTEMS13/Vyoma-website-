import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, Send, X, Sparkles, RefreshCw, User, ExternalLink, Minimize2 } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What products do you offer?',
  'Tell me about Nova',
  'What are the Curio pricing plans?',
  'How can I book a demo or contact sales?'
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! 👋 Welcome to Vyoma Learning Systems. How can I help you today?',
      sources: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('vyoma_chatbot_session') || '';
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isLoading) return;

    const userMessageText = text.trim();
    setInputMessage('');

    const userMsgId = 'user_' + Date.now();
    const newUserMsg = {
      id: userMsgId,
      role: 'user',
      content: userMessageText
    };

    const assistantMsgId = 'asst_' + Date.now();
    const initialAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      sources: [],
      isThinking: true
    };

    setMessages((prev) => [...prev, newUserMsg, initialAssistantMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessageText,
          sessionId: sessionId || undefined
        })
      });

      if (!response.ok) {
        let errMessage = "I couldn't process your request right now. Please try again.";
        try {
          const errData = await response.json();
          if (errData.error?.message) errMessage = errData.error.message;
        } catch (e) {}

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: errMessage, isThinking: false }
              : msg
          )
        );
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = null;

      const wordQueue = [];
      let isStreamFinished = false;

      const drainInterval = setInterval(() => {
        if (wordQueue.length > 0) {
          const nextWord = wordQueue.shift();
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === assistantMsgId) {
                return {
                  ...msg,
                  content: msg.content + nextWord,
                  isThinking: false
                };
              }
              return msg;
            })
          );
        } else if (isStreamFinished) {
          clearInterval(drainInterval);
        }
      }, 20);

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          isStreamFinished = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            currentEvent = null;
            continue;
          }

          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.slice(6).trim();
          } else if (trimmed.startsWith('data:')) {
            const dataStr = trimmed.slice(5).trim();
            try {
              const payload = JSON.parse(dataStr);

              if (currentEvent === 'token' && payload.token) {
                const subTokens = payload.token.match(/(\s+|\S+)/g) || [payload.token];
                wordQueue.push(...subTokens);
              } else if (currentEvent === 'sources' && payload.sources) {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === assistantMsgId) {
                      return {
                        ...msg,
                        sources: payload.sources
                      };
                    }
                    return msg;
                  })
                );
              } else if (currentEvent === 'done') {
                if (payload.sessionId) {
                  setSessionId(payload.sessionId);
                  localStorage.setItem('vyoma_chatbot_session', payload.sessionId);
                }
              } else if (currentEvent === 'error') {
                isStreamFinished = true;
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === assistantMsgId && !msg.content) {
                      return {
                        ...msg,
                        content: payload.error || 'Stream error occurred.',
                        isThinking: false
                      };
                    }
                    return msg;
                  })
                );
              }
            } catch (parseErr) {
              // Ignore non-JSON or partial line buffer chunks
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat streaming error:', err);
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMsgId && !msg.content) {
            return {
              ...msg,
              content: 'Unable to connect to Vyoma AI Assistant server. Please check your connection.',
              isThinking: false
            };
          }
          return msg;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem('vyoma_chatbot_session');
    setSessionId('');
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: 'Conversation reset. How can I assist you with Vyoma platforms today?',
        sources: []
      }
    ]);
  };

  return (
    <div style={styles.widgetWrapper}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.floatingButton}
          aria-label="Open AI Assistant Chat"
          title="Chat with Vyoma AI Assistant"
        >
          <div style={styles.iconGlow} />
          <Bot size={28} color="#ffffff" />
          <span style={styles.badgePulse} />
        </button>
      )}

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerTitleGroup}>
              <div style={styles.avatarBox}>
                <Bot size={20} color="#00f2fe" />
              </div>
              <div>
                <div style={styles.headerTitle}>Vyoma AI Assistant</div>
                <div style={styles.headerSubtitle}>
                  <span style={styles.onlineDot} /> Online • Powered by Gemini & RAG
                </div>
              </div>
            </div>
            <div style={styles.headerActions}>
              <button
                onClick={handleClearChat}
                style={styles.iconHeaderBtn}
                title="Reset Conversation"
              >
                <RefreshCw size={16} color="#94a3b8" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.iconHeaderBtn}
                title="Close Chat"
              >
                <X size={18} color="#94a3b8" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={styles.msgAvatar}>
                    <Sparkles size={14} color="#00f2fe" />
                  </div>
                )}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble)
                  }}
                >
                  {msg.isThinking && !msg.content ? (
                    <div style={styles.typingIndicator}>
                      <span style={styles.dot1} />
                      <span style={styles.dot2} />
                      <span style={styles.dot3} />
                    </div>
                  ) : (
                    <div style={styles.messageText}>{msg.content}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Suggested Questions (Show on 1st message) */}
            {messages.length <= 1 && !isLoading && (
              <div style={styles.suggestionsBox}>
                <div style={styles.suggestionsTitle}>Suggested Questions:</div>
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    style={styles.suggestionBtn}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={styles.inputForm}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about products, pricing, policies..."
              style={styles.textInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              style={{
                ...styles.sendButton,
                opacity: !inputMessage.trim() || isLoading ? 0.5 : 1
              }}
            >
              <Send size={18} color="#ffffff" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Premium Vyoma Learn / Curio Matching Design System
const styles = {
  widgetWrapper: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 99999,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  floatingButton: {
    position: 'relative',
    width: '62px',
    height: '62px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)',
    border: 'none',
    boxShadow: '0 10px 25px rgba(80, 70, 229, 0.4), 0 4px 10px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  badgePulse: {
    position: 'absolute',
    top: '3px',
    right: '3px',
    width: '13px',
    height: '13px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    border: '2px solid #ffffff'
  },
  chatWindow: {
    width: '390px',
    maxWidth: 'calc(100vw - 32px)',
    height: '560px',
    maxHeight: 'calc(100vh - 100px)',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15), 0 10px 20px rgba(80, 70, 229, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'fadeInUp 0.3s ease-out'
  },
  header: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 12px rgba(80, 70, 229, 0.15)'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatarBox: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    letterSpacing: '-0.01em'
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px'
  },
  onlineDot: {
    width: '7px',
    height: '7px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 0 6px #10b981'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  iconHeaderBtn: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    cursor: 'pointer',
    padding: '7px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: '#ffffff'
  },
  messagesContainer: {
    flex: 1,
    padding: '18px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: '#f8fafc'
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
  },
  msgAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    border: '1px solid #c7d2fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px',
    flexShrink: 0
  },
  messageBubble: {
    maxWidth: '82%',
    padding: '12px 16px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '1.55',
    wordBreak: 'break-word',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)'
  },
  userBubble: {
    background: 'linear-gradient(135deg, #5046e5 0%, #6366f1 100%)',
    color: '#ffffff',
    borderBottomRightRadius: '4px'
  },
  assistantBubble: {
    background: '#ffffff',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderBottomLeftRadius: '4px'
  },
  messageText: {
    whiteSpace: 'pre-wrap'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 6px'
  },
  dot1: { width: '6px', height: '6px', backgroundColor: '#5046e5', borderRadius: '50%' },
  dot2: { width: '6px', height: '6px', backgroundColor: '#5046e5', borderRadius: '50%' },
  dot3: { width: '6px', height: '6px', backgroundColor: '#5046e5', borderRadius: '50%' },
  suggestionsBox: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  suggestionsTitle: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '2px'
  },
  suggestionBtn: {
    textAlign: 'left',
    fontSize: '13px',
    color: '#334155',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '10px 14px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
  },
  inputForm: {
    padding: '14px 16px',
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  textInput: {
    flex: 1,
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '14px',
    padding: '11px 16px',
    color: '#0f172a',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  sendButton: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(80, 70, 229, 0.25)',
    transition: 'all 0.2s'
  }
};
