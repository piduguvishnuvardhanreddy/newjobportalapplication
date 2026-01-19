const axios = require('axios');

// Basic send email function using Vercel Relay
const sendEmail = async (to, subject, htmlContent, bcc = []) => {
    try {
        console.log('[EmailService] sending via Vercel Relay to:', to);
        if (bcc.length > 0) console.log(`[EmailService] BCC to ${bcc.length} recipients`);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        // Ensure strictly HTTPS for production Vercel
        const apiUrl = `${frontendUrl}/api/send-email`;

        const response = await axios.post(apiUrl, {
            to,
            bcc, // Pass BCC list to relay
            subject,
            html: htmlContent,
            secret: process.env.EMAIL_RELAY_SECRET
        });

        console.log('[EmailService] Vercel Relay Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('[EmailService] Vercel Relay Failed:', error.response ? error.response.data : error.message);
        // Fallback or rethrow? 
        // For now logging is enough.
    }
};

exports.verifyConnection = async () => {
    // Check if secret is set
    if (!process.env.EMAIL_RELAY_SECRET) {
        throw new Error('EMAIL_RELAY_SECRET is missing');
    }
    return true;
};

exports.sendJobPostEmail = async (users, job) => {
    // Send to ALL users individually via Relay
    // Since we are now using Gmail via Vercel, we can send to everyone! (Limit 500/day)

    // For efficiency, we'll BCC them in batches or one big BCC
    const bccList = users.map(u => u.email);

    if (bccList.length === 0) return;

    const subject = `New Job Alert: ${job.title} at ${job.company}`;
    const htmlContent = `
        <h1>New Job Opportunity!</h1>
        <p>A new job matching your interests has been posted.</p>
        <h2>${job.title}</h2>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p>${job.description.substring(0, 100)}...</p>
        <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" style="padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">View Job</a>
    `;

    // Send to Admin (To) and Everyone else (BCC)
    await sendEmail(process.env.SMTP_EMAIL, subject, htmlContent, bccList);
};

exports.sendApplicationUpdateEmail = async (user, status, jobTitle) => {
    const subject = `Application Update: ${jobTitle}`;
    const htmlContent = `
        <h1>Application Status Update</h1>
        <p>Hello ${user.name},</p>
        <p>Your application for the position of <strong>${jobTitle}</strong> has been updated.</p>
        <p><strong>New Status:</strong> <span style="color: ${status === 'accepted' ? 'green' : (status === 'rejected' ? 'red' : 'orange')}">${status.toUpperCase()}</span></p>
    `;

    await sendEmail(user.email, subject, htmlContent);
};

exports.sendFeedbackEmail = async (adminEmail, feedbackData) => {
    const subject = `New User Feedback`;
    const htmlContent = `Reason: ${feedbackData.reason}`;
    await sendEmail(adminEmail, subject, htmlContent);
};
