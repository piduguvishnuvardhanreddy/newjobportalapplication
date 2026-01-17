const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUserRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'vishnuvardhanreddy@nxtwave.co.in'; // using the verified sender email which is likely the user's email
        const user = await User.findOne({ email });
        if (user) {
            console.log(`User ${email} has role: ${user.role}`);
        } else {
            console.log(`User ${email} not found.`);
        }
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkUserRole();
