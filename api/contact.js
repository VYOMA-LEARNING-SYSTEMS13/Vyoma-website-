const nodemailer = require('nodemailer');

// Reuse nodemailer transporter across calls if possible (caching)
let transporter;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports (587 STARTTLS)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
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

    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_RECEIVER,
            replyTo: emailAddress.trim(),
            subject: 'New Vyoma Website Enquiry',
            text: `Full Name:\n${fullName.trim()}\n\nEmail Address:\n${emailAddress.trim()}\n\nMessage:\n${messageText.trim()}`
        };

        const activeTransporter = getTransporter();
        await activeTransporter.sendMail(mailOptions);
        console.log(`Contact message sent successfully. Recipient: ${process.env.CONTACT_RECEIVER}`);

        return res.status(200).json({
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

        return res.status(500).json({
            success: false,
            message: 'Unable to send your message right now. Please try again later.'
        });
    }
};
