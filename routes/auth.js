const express = require('express');
const passport = require('passport');

const Member = require('../models/member');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const jwt = require('jsonwebtoken')
const {log} = require("debug");

const router = express.Router();

// members에서 회원가입을 구현해놨기에 주석처리
// router.post('/join', isNotLoggedIn, async (req, res, next) => {
//     try {
//      const {username, nickName, pw} = req.body
//      exMember = await Member.findOne({where: {username}})
//      if(exMember) {
//          return res.redirect('/join?error=exists')
//      }
//      // 비밀번호 저장
//      const hash = await bcrypt.hash(pw, 12)
//      await Member.create({
//          username,
//          nickName,
//          pw : hash
//      })
//      return res.redirect('/')
//     }catch (err) {
//         console.error(err);
//         next(err);
//     }
// })

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, member, info) => {
        if(err) {
            console.error(err);
            console.log("???")

            return next(err);
        }
        if(!member) {
            return res.redirect(`/auth/?loginError=${info.message}`);
        }
        return req.login(member, {session:false}, (loginError) => {
            if(loginError) {
                return next(loginError);
            }
            const token = jwt.sign(
                {id:member.username, nickName:member.nickName},
                'jwt'
            )
            console.log('token ='+token)
            return res.json({token})
            // return res.send({token})
        });
    })(req, res, next);
});
   
router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout((err) => {
        if(err)  {
            console.log(err)
            return next(err)
        }
        res.clearCookie('connect.sid', {httpOnly: true})
        req.session.destroy();
        console.log('로그아웃 성공')
        // res.redirect('/');
        res.status(200).send({message: '성공!'});
    })
});
router.post('/checkId', async function(req, res) {
    let username = req.body.username;
    let checkUsername = await Member.findOne({username : username}, {_id:0, pw:0, nickName:0, regDate:0, updateDate:0});
    if(checkUsername) {
        console.log('아이디 중복 '+checkUsername);
        res.status(200).json({
            checkUsername:false
        })
    }else {
        console.log('사용 가능한 id '+checkUsername)
        res.status(200).json({
            checkUsername:true
        })
    }
})

router.post('/checkNickName', async function(req, res) {
    let nickName = req.body.nickName;
    let checkNickName = await Member.findOne({nickName : nickName}, {_id:0, pw:0, username:0, regDate:0, updateDate:0});
    if(checkNickName) {
        console.log('닉네임 중복 ');
        res.status(200).json({
            checkNickName:false
        })
    }else {
        console.log('사용 가능한 닉네임 ')
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

module.exports = router;