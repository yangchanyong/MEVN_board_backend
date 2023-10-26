const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JWTStrategy = require('passport-jwt').Strategy
const Member = require("../models/member");

const JWTConfig = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'jwt'
}

const JWTVerify = async (jwtPayload, done) => {
    try {
        const member = await Member.findOne({username: jwtPayload.username});
        if(member) {
            return done(null, member);
        }
        done(null, false, {reason:'올바르지 않은 인증정보 입니다.'});
    }catch (error) {
        console.log(error);
        done(error);
    }
}
module.exports = () => {
    console.log('jwt strategy')
    passport.use('jwt',
        new JWTStrategy(
            JWTConfig,JWTVerify
        )
    )
}


