const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// @desc    Test Email Connection
// @route   GET /api/debug/test-email
// @access  Public (Temporary for debugging)
router.get('/test-email', async (req, res) => {
    try {
        console.log('[Debug] Testing SMTP Connection...');

        // 1. Verify Login
        await emailService.verifyConnection();
        console.log('[Debug] SMTP Connection Verified.');

        // 2. Send Test Email to Self
        const testSubject = 'Test Email from Render Debugger';
        const testHtml = '<h1>It Works!</h1><p>This is a test email to verify your SMTP settings.</p>';

        // Send to the SMTP_EMAIL itself
        await emailService.sendJobPostEmail([{ email: process.env.SMTP_EMAIL }], {
            title: 'Test Job',
            company: 'Test Company',
            salary: 'N/A',
            description: 'Test Description',
            _id: 'debug-id'
        });

        res.status(200).json({
            success: true,
            message: 'SMTP connection verified and test email attempted. Check server logs for send result.'
        });

    } catch (error) {
        console.error('[Debug] SMTP Failure:', error);
        res.status(500).json({
            success: false,
            message: 'SMTP Connection Failed',
            error: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command
        });
    }
});

module.exports = router;
