const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// @desc    Test Email Connection (Vercel Relay)
// @route   GET /api/debug/test-email
// @access  Public
router.get('/test-email', async (req, res) => {
    try {
        console.log('[Debug] Testing Vercel Relay Connection...');

        // 1. Verify Config
        await emailService.verifyConnection();
        console.log('[Debug] Relay Secret Present.');

        // 2. Send Test Email
        // Sending to the Admin email defined in env
        const recipient = process.env.SMTP_EMAIL;

        await emailService.sendJobPostEmail([{ email: recipient }], {
            title: 'Test Job (Vercel Relay)',
            company: 'Test Company',
            salary: 'N/A',
            description: 'This is a test email sent via Vercel Serverless Function.',
            _id: 'debug-relay-id'
        });

        res.status(200).json({
            success: true,
            message: 'Relay request sent. Check frontend logs or inbox.',
            recipient: recipient
        });

    } catch (error) {
        console.error('[Debug] Relay Failure:', error);
        res.status(500).json({
            success: false,
            message: 'Relay Test Failed',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
