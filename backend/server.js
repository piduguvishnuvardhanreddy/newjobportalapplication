const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

dotenv.config();
require('./config/passport'); // Passport Config

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy is required for secure cookies on Render/Heroku
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Render URL or Vite default port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(passport.initialize());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal')
    .then(() => {
        console.log('MongoDB Connected');
        console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);
    })
    .catch(err => console.error(`MongoDB Connection Error: ${err}`));


app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`[DEBUG] Server restarted at ${new Date().toISOString()}`);
});
