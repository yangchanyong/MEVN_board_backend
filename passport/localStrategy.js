const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Member = require('../models/member');

module.exports = () => {
    console.log('local strategy 생성')
    passport.use(
        new LocalStrategy(
            {
                usernameField : 'username',
                passwordField : 'pw'

                // session : true
            },
            async (username, pw, done) => {
                try {
                    console.log(username);

                    const logMember = await Member.findOne({ where: username });
                    console.log("logMember : ", logMember)
                    if(logMember) {
                        const result = await bcrypt.compare(pw, logMember.pw)
                        if(result) {
                            done(null, logMember);
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
    console.log('LocalStrategy = '. LocalStrategy);
};