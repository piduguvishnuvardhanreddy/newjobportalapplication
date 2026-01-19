const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Basic send email function
const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log('[EmailService] Sending email to:', to);
        const data = await resend.emails.send({
            from: 'Job Portal <onboarding@resend.dev>', // Use default Resend domain for testing
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log('[EmailService] Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('[EmailService] Error sending email:', error);
        throw error;
    }
};

// Verify connection function (Resend doesn't have a verify method like SMTP, so we check API key presence)
exports.verifyConnection = async () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is missing');
    }
    return true;
};

exports.sendJobPostEmail = async (users, job) => {
    // Collect all emails
    // Resend free tier sends to only verified email (onboarding@resend.dev to verified email)
    // or if domain is verified.
    // For MVP/Debug: We can usually send TO the registered admin email.

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

    try {
        console.log(`[EmailService] Broadcasting to ${bccList.length} users via Resend...`);

        // Resend constraint: 'to' field is required. 'bcc' is optional.
        // For mass sending, using bcc is good, but Resend limits might apply.
        // Best practice: Send individual emails or use 'bq' (batch queue) if enterprise.
        // Simple approach for now: Send to self, BCC others.

        const data = await resend.emails.send({
            from: 'Job Portal <onboarding@resend.dev>',
            to: process.env.SMTP_EMAIL || 'delivered@resend.dev', // Fallback
            bcc: bccList,
            subject: subject,
            html: htmlContent
        });

        console.log('[EmailService] Broadcast sent:', data);
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
