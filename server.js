const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Resolve Zoho SMTP configuration with backward-compatible fallbacks
const smtpHost = process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST || 'smtp.zoho.in';
const smtpPort = Number(process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || 465);
const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER || '';
const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASSWORD || '';
const smtpFrom = process.env.SMTP_FROM || smtpUser;
const contactReceiver = process.env.CONTACT_RECEIVER;
const isSecure = smtpPort === 465;

// Startup check for required Zoho SMTP environment variables
console.log('=== Zoho SMTP Environment Configuration Check ===');
console.log(`SMTP Host: ${smtpHost}`);
console.log(`SMTP Port: ${smtpPort} (SSL/TLS: ${isSecure ? 'Enabled' : 'Disabled, using STARTTLS'})`);
console.log(`SMTP User: ${smtpUser && !smtpUser.includes('your-email@yourdomain.com') ? 'configured' : (smtpUser ? 'placeholder' : 'missing')}`);
console.log(`SMTP Password: ${smtpPass && !smtpPass.includes('your-zoho-app-password') ? 'configured' : (smtpPass ? 'placeholder' : 'missing')}`);
console.log(`SMTP From: ${smtpFrom ? 'configured' : 'missing'}`);
console.log(`Contact Receiver: ${contactReceiver ? 'configured' : 'missing'}`);
console.log('==================================================');

// Create Nodemailer Transporter for Zoho SMTP
const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: isSecure, // true for 465 (SSL/TLS), false for 587 (STARTTLS)
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

// Verify the SMTP connection if credentials are configured
const isPlaceholder = !smtpUser || !smtpPass || smtpUser.includes('your-email@yourdomain.com') || smtpPass.includes('your-zoho-app-password');
if (!isPlaceholder) {
    transporter.verify((error, success) => {
        if (error) {
            // Redact any potential SMTP credentials or keys from the message text
            let safeMsg = error.message || '';
            if (smtpPass) {
                safeMsg = safeMsg.replace(new RegExp(escapeRegExp(smtpPass), 'g'), '[REDACTED_PASSWORD]');
            }
            if (smtpUser) {
                safeMsg = safeMsg.replace(new RegExp(escapeRegExp(smtpUser), 'g'), '[REDACTED_USER]');
            }
            console.error('Zoho SMTP connection verification failed. Error details:', safeMsg);
        } else {
            console.log('Zoho SMTP connection successful');
        }
    });
} else {
    console.log('Zoho SMTP credentials set to placeholders. Transporter configured successfully; connection verification deferred until valid credentials are provided.');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Middleware
app.use(cors());
app.use(express.json());

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
            from: smtpFrom,
            to: contactReceiver,
            replyTo: emailAddress.trim(),
            subject: 'New Vyoma Website Enquiry',
            text: `Full Name:\n${fullName.trim()}\n\nEmail Address:\n${emailAddress.trim()}\n\nMessage:\n${messageText.trim()}`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Contact message sent successfully. Recipient: ${contactReceiver}`);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully.'
        });
    } catch (error) {
        // Redact any potential SMTP credentials or keys from the message text
        let safeMsg = error.message || '';
        if (smtpPass) {
            safeMsg = safeMsg.replace(new RegExp(escapeRegExp(smtpPass), 'g'), '[REDACTED_PASSWORD]');
        }
        if (smtpUser) {
            safeMsg = safeMsg.replace(new RegExp(escapeRegExp(smtpUser), 'g'), '[REDACTED_USER]');
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
            from: smtpFrom,
            to: contactReceiver,
            subject: 'Vyoma Zoho SMTP Test',
            text: 'This is a test email from the Vyoma website backend. Zoho SMTP configuration is working successfully.'
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
        if (smtpPass) {
            safeMsg = safeMsg.replace(new RegExp(escapeRegExp(smtpPass), 'g'), '[REDACTED_PASSWORD]');
        }
        if (smtpUser) {
            safeMsg = safeMsg.replace(new RegExp(escapeRegExp(smtpUser), 'g'), '[REDACTED_USER]');
        }
        console.error('Failed to send test email:', safeMsg);

        res.status(500).json({
            success: false,
            message: 'Failed to send test email. Please check server logs.'
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
