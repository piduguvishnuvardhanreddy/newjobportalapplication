const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userCount = await User.countDocuments({ role: 'user' });
        console.log(`Number of users with role 'user': ${userCount}`);

        const allUsers = await User.find({});
        console.log('All users roles:', allUsers.map(u => ({ email: u.email, role: u.role })));

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkUsers();
