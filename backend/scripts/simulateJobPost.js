const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const emailService = require('../services/emailService');

const simulateJobPost = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Fetch users like the controller does
        const users = await User.find({ role: 'user' });
        console.log(`Fetched ${users.length} users with role 'user'`);

        // 2. Mock an admin user "req.user"
        // Try to find an admin or just create a mock document-like object
        // Or fetch ANY user to treat as admin
        const admin = await User.findOne({ email: 'vishnuvardhanreddy@nxtwave.co.in' });

        if (admin) {
            console.log('Found admin user:', admin.email);
            users.push(admin);
        } else {
            console.log('Admin not found in DB, using mock.');
            users.push({ email: 'vishnuvardhanreddy@nxtwave.co.in', name: 'Admin Mock' });
        }

        console.log(`Total recipients: ${users.length}`);

        const job = {
            title: 'Simulation Job',
            company: 'Sim Corp',
            salary: '500k',
            description: 'Simulation description for email debug.'
        };

        console.log('Calling sendJobPostEmail with fetched users...');
        await emailService.sendJobPostEmail(users, job);
        console.log('Simulation completed.');

        mongoose.connection.close();
    } catch (err) {
        console.error('Simulation Failed:', err);
    }
};

simulateJobPost();
