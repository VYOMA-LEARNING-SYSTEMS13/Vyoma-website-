const nodemailer = require('nodemailer');

// Reuse nodemailer transporter across calls if possible (caching)
let transporter;

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTransporter() {
    if (!transporter) {
        const smtpHost = process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST || 'smtp.zoho.in';
        const smtpPort = Number(process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || 465);
        const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER || '';
        const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASSWORD || '';
        const isSecure = smtpPort === 465;

        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: isSecure, // true for 465 (SSL/TLS), false for other ports (587 STARTTLS)
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });
    }
    return transporter;
}

module.exports = async (req, res) => {
    // Vercel serverless functions automatically parse req.body for JSON if Content-Type matches.
    if (req.method !== 'POST') {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid contact information.'
        });
    }

    const { fullName, emailAddress, messageText } = req.body || {};

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

    const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER || '';
    const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASSWORD || '';
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const contactReceiver = process.env.CONTACT_RECEIVER;

    try {
        const mailOptions = {
            from: smtpFrom,
            to: contactReceiver,
            replyTo: emailAddress.trim(),
            subject: 'New Vyoma Website Enquiry',
            text: `Full Name:\n${fullName.trim()}\n\nEmail Address:\n${emailAddress.trim()}\n\nMessage:\n${messageText.trim()}`
        };

        const activeTransporter = getTransporter();
        await activeTransporter.sendMail(mailOptions);
        console.log(`Contact message sent successfully. Recipient: ${contactReceiver}`);

        return res.status(200).json({
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

        return res.status(500).json({
            success: false,
            message: 'Unable to send your message right now. Please try again later.'
        });
    }
};
