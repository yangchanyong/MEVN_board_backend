const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/member');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        User.findOne({where: {username}})
            .then(user => done(null, user))
            .catch(err => done(err));
    })

    local();
}