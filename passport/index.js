const passport = require('passport');
const local = require('./localStrategy');
const jwt = require('./JWTStrategy')
const Member = require('../models/member');


module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('시리얼라이즈 유저', user)
        done(null, user.username);
    })

    passport.deserializeUser((username, done) => {
        Member.findOne({username: username})
            .then(user => done(null, user))
            .catch(err => done(err));
    })
    local();
    jwt();
}