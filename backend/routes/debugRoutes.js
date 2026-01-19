const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// @desc    Test Email Connection (Resend)
// @route   GET /api/debug/test-email
// @access  Public (Temporary for debugging)
router.get('/test-email', async (req, res) => {
    try {
        console.log('[Debug] Testing Resend Connection...');

        // 1. Verify Config
        await emailService.verifyConnection();
        console.log('[Debug] Resend Key Present.');

        // 2. Send Test Email to Self (using the configured SMTP_EMAIL or a safely default)
        const recipient = process.env.SMTP_EMAIL || 'delivered@resend.dev';

        await emailService.sendJobPostEmail([{ email: recipient }], {
            title: 'Test Job (Resend)',
            company: 'Test Company',
            salary: 'N/A',
            description: 'This is a test email sent via Resend API.',
            _id: 'debug-resend-id'
        });

        res.status(200).json({
            success: true,
            message: 'Resend API called. Check your inbox (and spam folder) for the test email.',
            recipient: recipient
        });

    } catch (error) {
        console.error('[Debug] Resend Failure:', error);
        res.status(500).json({
            success: false,
            message: 'Resend Test Failed',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
