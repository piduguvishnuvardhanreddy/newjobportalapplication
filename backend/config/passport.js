const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if user already exists with this googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // 2. Check if user exists with this email (link account)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Link googleId to existing user
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            // 3. Create new user
            // Generate a random password since it's required by schema
            const randomPassword = crypto.randomBytes(20).toString('hex');

            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: randomPassword,
                googleId: profile.id,
                role: 'user' // Default role
            });

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

// Serialize/Deserialize not needed for JWT sessionless auth, but passport might ask for it
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
