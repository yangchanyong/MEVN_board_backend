const express = require('express');
const passport = require('passport');

const Member = require('../models/member');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
// const jwt = require('jsonwebtoken')
const jwt = require('../jwt-util/jwt-util')
const {redisClient} = require("../redis-util/redis-util");

const authJwt = require('../midlewares/authJWT')
const refresh = require("../jwt-util/refresh");

const router = express.Router();

const secret = process.env.JWT_SECRET;
const jsonwebtoken = require('jsonwebtoken');

const {seeProfile, modifyProfile, modifyPw} = require('./profile')


// login
router.post('/login', isNotLoggedIn, (req, res, next) => {
    // local 전략으로 로그인 (/passport/localStrategy 실행)
    passport.authenticate('local', (err, member, info) => {
        if(err) {
            console.error(err);
            console.log("???")
            return next(err);
        }
        // member가 없을경우 실행
        if(!member) {
            return res.redirect(`/auth/?loginError=${info.message}`);
        }
        // member가 있을경우 실행
        return req.login(member, {session:false}, (loginError) => {
            // 에러 발생시 실행
            if(loginError) {
                return next(loginError);
            }
            // const token = jwt.sign(
            //     {id:member.username, nickName:member.nickName},
            //     'jwt',
            //     {
            //         expiresIn: '1M'
            //     }
            // )
            // console.log('token ='+token)
            // return res.json({token})

            // 액세스 토큰 생성
            const accessToken = `Bearer ${jwt.sign(member)}`;
            // 리프레시 토큰 생성
            const refreshToken = jwt.refresh();

            // redis
            redisClient.set(member.username, refreshToken);
            // redis refreshToken 만료시간 설정
            redisClient.expire(member.username, 60*60*24*14)

            // 토큰에 만료시간이 있기에, 만료시간을 정할 필요가 없음
            // res.header({
            //     'Authorization' : `Bearer ${accessToken}`,
            //     'refresh' : refreshToken
            // })
            // client에 access, refresh token 반환
            res.status(200).json({
                ok: true,
                data: {
                    accessToken,
                    refreshToken,
                },
            })

            // return res.send({token})
        });
    })(req, res, next);
});
   
router.post('/logout', (req, res, next) => {
    console.log('로그아웃 통신')
    try {
        if(req.headers['authorization'] && req.headers['refresh']) {
            
            const accessToken = req.headers['authorization'].split('Bearer ')[1];
            console.log(accessToken)
            // const decode = jwt.verify(accessToken);
            // if(decode.ok) {
            //     console.log('decoded = ', decode)
            //     redisClient.del(decode.id)
            //     return res.status(200).send({message: '성공!'});
            // }else {
            const decode = jsonwebtoken.decode(accessToken);
            console.log('auth.js decoded = ', decode)
            redisClient.del(decode.id);
            return res.status(200).send({message: '성공!2'})
            // }
            
        }else {
            console.log('토큰없음')
            return res.status(403).json({message: '로그인한 상태가 아닙니다.'})
        }
    }
    catch (e) {
        console.log(e)
    }
});


// username 중복체크
router.post('/checkId', async function(req, res) {
    // front에서 전송한 username 변수에 저장
    let username = req.body.username;
    // 사용된 username이 있는지 확인
    let checkUsername = await Member.findOne({username : username}, {_id:0, pw:0, nickName:0, regDate:0, updateDate:0});
    // username이 중복일 경우
    if(checkUsername) {
        console.log('아이디 중복 '+checkUsername);
        res.status(200).json({
            checkUsername:false
        })
    }else {
        console.log('사용 가능한 id '+checkUsername)
        // username이 중복이 아닐경우 json형태로 전송
        res.status(200).json({
            checkUsername:true
        })
    }
})

// nickName 중복체크
router.post('/checkNickName', async function(req, res) {
    // front에서 전송된 nickName 변수에 저장
    let nickName = req.body.nickName;
    // 전송된 nickName의 값이 있는지 db 조회
    let checkNickName = await Member.findOne({nickName : nickName}, {_id:0, pw:0, username:0, regDate:0, updateDate:0});
    if(checkNickName) {
        console.log('닉네임 중복 ');
        // nickName이 중복일경우
        res.status(200).json({
            checkNickName:false
        })
    }else {
        console.log('사용 가능한 닉네임 ')
        // nickName 사용 가능할 경우
        res.status(200).json({
            checkNickName:true
        })
    }
})

router.post('/jwt', passport.authenticate('jwt', {session:false}),
    async (req,res,next) => {
        try {
            // res.json({result:true, message:'good!'})
            res.send({result:true, message:'good!'})
        }catch (error) {
            console.error(error)
            next(error);
        }
    });


router.get('/profile', authJwt, seeProfile);

router.patch('/modify', authJwt, modifyProfile)

router.patch('/modifyPw', authJwt, modifyPw)

router.get('/refresh', refresh);


module.exports = router;