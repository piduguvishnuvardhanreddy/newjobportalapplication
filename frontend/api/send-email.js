import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin for now, or restrict to your backend URL
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, subject, html, secret } = req.body;

    // 1. Security Check
    if (secret !== process.env.EMAIL_RELAY_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Secret' });
    }

    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 2. Configure Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // 3. Send Email
        const info = await transporter.sendMail({
            from: `"Job Portal" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent:', info.messageId);
        return res.status(200).json({ success: true, messageId: info.messageId });

    } catch (error) {
        console.error('Email send failed:', error);
        return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
}
