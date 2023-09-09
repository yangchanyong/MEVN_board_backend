const passport = require('passport');
const local = require('./localStrategy');
const Member = require('../models/member');

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('시리얼라이즈 유저', user)
        done(null, user.id);
    })

    passport.deserializeUser((username, done) => {
        Member.findOne({where: {username}})
            .then(user => done(null, user))
            .catch(err => done(err));
    })

    local();
}