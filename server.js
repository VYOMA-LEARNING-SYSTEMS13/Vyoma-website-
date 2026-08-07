const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Startup check for required environment variables
const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'SMTP_FROM',
    'CONTACT_RECEIVER'
];

console.log('=== SMTP Environment Variable Check ===');
requiredEnvVars.forEach((varName) => {
    const isConfigured = process.env[varName] !== undefined && process.env[varName].trim() !== '';
    console.log(`${varName}: ${isConfigured ? 'configured' : 'missing'}`);
});
console.log('=======================================');

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports (587 STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify the SMTP connection
transporter.verify((error, success) => {
    if (error) {
        // Redact any potential SMTP credentials or keys from the message text
        let safeMsg = error.message || '';
        // If there's an actual password or key, we can scrub a generic pattern or key pattern
        if (process.env.SMTP_PASSWORD) {
            safeMsg = safeMsg.replace(new RegExp(process.env.SMTP_PASSWORD, 'g'), '[REDACTED_PASSWORD]');
        }
        if (process.env.SMTP_USER) {
            safeMsg = safeMsg.replace(new RegExp(process.env.SMTP_USER, 'g'), '[REDACTED_USER]');
        }
        console.error('SMTP connection verification failed. Error details:', safeMsg);
    } else {
        console.log('SMTP connection successful');
    }
});

// Chatbot Module Imports
const { validateEnv } = require('./chatbot/config/env');
const { securityMiddleware } = require('./chatbot/middleware/security.middleware');
const { errorHandler } = require('./chatbot/middleware/error.middleware');
const chatbotRouter = require('./chatbot/routes');

// Validate Chatbot Environment Variables on Startup
validateEnv();

// Middleware
app.use(securityMiddleware);
app.use(cors());
app.use(express.json());

// Mount Chatbot API Router
app.use('/api/chatbot', chatbotRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running"
    });
});

// Contact/Enquiry POST Endpoint
app.post('/api/contact', async (req, res) => {
    const { fullName, emailAddress, messageText } = req.body;

    // Validate presence and type of required fields
    if (
        !fullName || typeof fullName !== 'string' || !fullName.trim() ||
        !emailAddress || typeof emailAddress !== 'string' || !emailAddress.trim() ||
        !messageText || typeof messageText !== 'string' || !messageText.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid contact information.'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid contact information.'
        });
    }

    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_RECEIVER,
            replyTo: emailAddress.trim(),
            subject: 'New Vyoma Website Enquiry',
            text: `Full Name:\n${fullName.trim()}\n\nEmail Address:\n${emailAddress.trim()}\n\nMessage:\n${messageText.trim()}`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Contact message sent successfully. Recipient: ${process.env.CONTACT_RECEIVER}`);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully.'
        });
    } catch (error) {
        // Redact any potential SMTP credentials or keys from the message text
        let safeMsg = error.message || '';
        if (process.env.SMTP_PASSWORD) {
            safeMsg = safeMsg.replace(new RegExp(process.env.SMTP_PASSWORD, 'g'), '[REDACTED_PASSWORD]');
        }
        if (process.env.SMTP_USER) {
            safeMsg = safeMsg.replace(new RegExp(process.env.SMTP_USER, 'g'), '[REDACTED_USER]');
        }
        console.error('Failed to send contact message email:', safeMsg);

        res.status(500).json({
            success: false,
            message: 'Unable to send your message right now. Please try again later.'
        });
    }
});

// Test Email Endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_RECEIVER,
            subject: 'Vyoma SMTP Test',
            text: 'This is a test email from the Vyoma website backend. SMTP configuration is working successfully.'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully. Msg ID:', info.messageId);

        res.status(200).json({
            success: true,
            message: 'Test email sent successfully.'
        });
    } catch (error) {
        // Redact potential secrets from the error output
        let safeMsg = error.message || '';
        if (process.env.SMTP_PASSWORD) {
            safeMsg = safeMsg.replace(new RegExp(process.env.SMTP_PASSWORD, 'g'), '[REDACTED_PASSWORD]');
        }
        if (process.env.SMTP_USER) {
            safeMsg = safeMsg.replace(new RegExp(process.env.SMTP_USER, 'g'), '[REDACTED_USER]');
        }
        console.error('Failed to send test email:', safeMsg);

        res.status(500).json({
            success: false,
            message: 'Failed to send test email. Please check server logs.'
        });
    }
});

// Central Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
