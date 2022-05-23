const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById({ _id: id }, {
        password: 0
    })
        .then(user => {
            done(null, user);
        })
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            await User.findOne({ googleId: profile.id })
                .then(async (data) => {
                    if (data) {
                        done(null, data);
                    } else {
                        const password = await bcrypt.hash('123123', 10);
                        new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            full_name: profile.displayName,
                            password,
                            avatar: profile.photos[0].value
                        }).save().then(user => done(null, user));
                    }
                })
        } catch (e) {
            throw new Error(e);
        }
    }
));
