const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const emailService = require('../services/emailService');

const testEmail = async () => {
    // A dummy user object
    const users = [{ email: 'vishnuvardhanreddy@nxtwave.co.in', name: 'Vishnu' }];
    const job = {
        title: 'Test Job for Verification',
        company: 'Verification Corp',
        salary: '1M',
        description: 'This is a test job description to verify email functionality after API key update.'
    };

    console.log('Testing sendJobPostEmail with API Key starting with:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) : 'undefined');

    try {
        await emailService.sendJobPostEmail(users, job);
        console.log('Test email function executed successfully.');
    } catch (err) {
        console.error('Test failed:', err);
    }
};

testEmail();
