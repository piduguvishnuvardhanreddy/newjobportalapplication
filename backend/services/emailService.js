const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Explicit host
    port: 587,              // Standard TLS port
    secure: false,          // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

// Basic send email function
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"Job Portal" <${process.env.SMTP_EMAIL}>`,
        to: to,
        subject: subject,
        html: htmlContent
    };

    // Return the promise directly so callers can await it and catch errors
    console.log('[EmailService] Sending email to:', to);
    return transporter.sendMail(mailOptions);
};

// Verify connection function
exports.verifyConnection = async () => {
    return transporter.verify();
};

exports.sendJobPostEmail = async (users, job) => {
    // Collect all emails
    const bccList = users.map(u => u.email);

    if (bccList.length === 0) {
        console.log('[JobBroadcast] No recipients found.');
        return;
    }

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

    // Send using BCC to protect privacy and send in one go
    // Note: Gmail has limits (500/day, 100 recipients per mail approx). 
    // For MVP this is fine.

    // We send TO the sender (or a no-reply) and BCC everyone else
    const mailOptions = {
        from: `"Job Portal" <${process.env.SMTP_EMAIL}>`,
        to: process.env.SMTP_EMAIL, // Send to self
        bcc: bccList, // BCC all users
        subject: subject,
        html: htmlContent
    };

    try {
        console.log(`[EmailService] Broadcasting to ${bccList.length} users via Gmail BCC...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('[EmailService] Broadcast sent: %s', info.messageId);
    } catch (error) {
        console.error('[EmailService] Broadcast failed:', error);
    }
};

exports.sendApplicationUpdateEmail = async (user, status, jobTitle) => {
    const subject = `Application Update: ${jobTitle}`;
    const htmlContent = `
        <h1>Application Status Update</h1>
        <p>Hello ${user.name},</p>
        <p>Your application for the position of <strong>${jobTitle}</strong> has been updated.</p>
        <p><strong>New Status:</strong> <span style="color: ${status === 'accepted' ? 'green' : (status === 'rejected' ? 'red' : 'orange')}">${status.toUpperCase()}</span></p>
        <p>Visit your dashboard for more details.</p>
    `;

    await sendEmail(user.email, subject, htmlContent);
};

exports.sendFeedbackEmail = async (adminEmail, feedbackData) => {
    const subject = `New User Feedback: Not Interested`;
    const htmlContent = `
        <h1>User Feedback</h1>
        <p>A user marked a job as "Not Interested".</p>
        <p><strong>Reason:</strong> ${feedbackData.reason}</p>
        <p><strong>Job ID:</strong> ${feedbackData.jobId}</p>
        <p><strong>User ID:</strong> ${feedbackData.userId}</p>
    `;

    await sendEmail(adminEmail, subject, htmlContent);
};
