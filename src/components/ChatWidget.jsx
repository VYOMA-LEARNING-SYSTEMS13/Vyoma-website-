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

                  {/* Citation badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={styles.citationsWrapper}>
                      <span style={styles.sourcesLabel}>Sources:</span>
                      {msg.sources.map((src, idx) => (
                        <span key={idx} style={styles.citationBadge}>
                          {src.title}
                        </span>
                      ))}
                    </div>
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

// Inline Glassmorphism & Modern Responsive Styling
const styles = {
  widgetWrapper: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 99999,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  floatingButton: {
    position: 'relative',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    border: 'none',
    boxShadow: '0 8px 24px rgba(0, 242, 254, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  badgePulse: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    border: '2px solid #0f172a'
  },
  chatWindow: {
    width: '380px',
    maxWidth: 'calc(100vw - 32px)',
    height: '540px',
    maxHeight: 'calc(100vh - 100px)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 254, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'fadeInUp 0.3s ease-out'
  },
  header: {
    padding: '16px',
    background: 'rgba(30, 41, 59, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatarBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(0, 242, 254, 0.12)',
    border: '1px solid rgba(0, 242, 254, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600'
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  onlineDot: {
    width: '7px',
    height: '7px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'inline-block'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  iconHeaderBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
  },
  messagesContainer: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  },
  msgAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'rgba(0, 242, 254, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px'
  },
  messageBubble: {
    maxWidth: '82%',
    padding: '12px 14px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  userBubble: {
    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    color: '#ffffff',
    borderBottomRightRadius: '4px'
  },
  assistantBubble: {
    background: 'rgba(30, 41, 59, 0.9)',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: '4px'
  },
  messageText: {
    whiteSpace: 'pre-wrap'
  },
  citationsWrapper: {
    marginTop: '8px',
    paddingTop: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4px'
  },
  sourcesLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  citationBadge: {
    fontSize: '10px',
    color: '#00f2fe',
    background: 'rgba(0, 242, 254, 0.1)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px'
  },
  dot1: { width: '6px', height: '6px', backgroundColor: '#00f2fe', borderRadius: '50%' },
  dot2: { width: '6px', height: '6px', backgroundColor: '#00f2fe', borderRadius: '50%' },
  dot3: { width: '6px', height: '6px', backgroundColor: '#00f2fe', borderRadius: '50%' },
  suggestionsBox: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  suggestionsTitle: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '2px',
    fontWeight: '500'
  },
  suggestionBtn: {
    textAlign: 'left',
    fontSize: '12px',
    color: '#e2e8f0',
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '8px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  inputForm: {
    padding: '12px 16px',
    background: 'rgba(30, 41, 59, 0.8)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  textInput: {
    flex: 1,
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none'
  },
  sendButton: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
