const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Member = require('../models/member');

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

                    const exUser = await Member.findOne({ username : username});
                    console.log("exUser : ", exUser)
                    if(exUser) {
                        const result = await bcrypt.compare(pw, exUser.pw)
                        if(result) {
                            return done(null, exUser);
                        }else {
                            done(null, false, {message : '비밀번호가 일치하지 않습니다.'})
                        }
                        done(null, false, {message : '가입되지 않은 회원입니다.'})
                    }
                }catch (err) {
                    console.error("err =",err)
                    done(err)
                }
            },
        ),
    );
};