const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/member');

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField : 'username',
                passwordField : 'pw',

                // session : true
            },
            async (username, pw, done) => {
                try {
                    console.log(username);

                    const logUser = await User.findOne({username: username });
                    if(logUser) {
                        const result = await bcrypt.compare(pw, logUser.pw)
                        if(result) {
                            done(null, logUser);
                        }else {
                            done(null, false, {message : '비밀번호가 일치하지 않습니다.'})
                        }
                    }else {
                        done(null, false, {message : '가입되지 않은 회원입니다.'})
                    }
                }catch (err) {
                    console.error(err)
                    done(err)
                }
            },
        ),
    );
};