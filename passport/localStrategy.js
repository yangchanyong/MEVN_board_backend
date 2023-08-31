const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/member');

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                _usernameField : 'username',
                _passwordField : 'pw',
                session : true
            },
            async (username, pw, done) => {
                try {
                    const exUser = await User.findOne({where : {email} });
                    if(exUser) {
                        // const result = await
                    }
                }catch (err) {

                }
            }
        )
    )
}