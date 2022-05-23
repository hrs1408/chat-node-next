const passport = require('passport')
const User = require('../models/User')
const FacebookStrategy = require('passport-facebook').Strategy;
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ["email", "name", "picture.type(large)"]
},
    async function (accessToken, refreshToken, profile, done) {
        await User.findOne({ facebookId: profile.id })
            .then(async (data) => {
                if (data) {
                    done(null, data);
                } else {
                    const password = await bcrypt.hash('123123', 10);
                    new User({
                        facebookId: profile.id,
                        email: profile.emails[0].value,
                        full_name: `${profile.name.givenName} ${profile.name.familyName}`,
                        password,
                        avatar: profile.photos[0].value
                    }).save().then(user => done(null, user));
                }
            })
        done(null, profile);
    }
));


