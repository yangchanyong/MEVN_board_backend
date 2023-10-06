const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const Member = require('../models/member');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

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
    console.log("호출되니..?")
    console.log('login user ->', req.body);
    // const {username, pw} = req.body;
    passport.authenticate('local', (err, member, info) => {
        if(err) {
            console.error(err);
            console.log("???")

            return next(err);
        }
        if(!member) {
            console.log(member+"왜 없지?");
            console.log(info)
            return res.redirect(`/auth/?loginError=${info.message}`);
        }
        return req.login(member, loginError => {
            if(loginError) {
                console.error(loginError);
                console.log(member+"!!!");
                return next(loginError);
            }
            // return res.json({message:"로그인"});
            return res.send(member);
            // return res.redirect('/');
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

router.get('/checkId', async function(req, res) {
    let username = req.body.username;
    let checkUsername = await Member.findOne({username : username}, {_id:0, pw:0, nickName:0, regDate:0, updateDate:0});
    if(checkUsername) {
        console.log(checkUsername);
        return res.send({message: '중복된 id입니다.'})
    }else {
        return res.send({checkUsername:checkUsername})
    }
})

module.exports = router;