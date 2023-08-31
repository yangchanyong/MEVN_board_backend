const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const Member = require('../models/member');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    try {
     const {username, nickName, pw} = req.body
     exMember = await Member.findOne({where: {username}})
     if(exMember) {
         return res.redirect('/join?error=exists')
     }
     // 비밀번호 저장
     const hash = await bcrypt.hash(pw, 12)
     await Member.create({
         username,
         nickName,
         pw : hash
     })
     return res.redirect('/')
    }catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/login', isNotLoggedIn, (req, res, next) => {
    console.log("호출되니..?")
    // const {username, pw} = req.body;
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.error(err);
            console.log("???")

            return next(err);
        }
        if(!user) {
            console.log(user);
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, loginError => {
            if(loginError) {
                console.error(loginError);
                console.log(user+"!!!");
                return next(loginError);
            }
            return res.json({message:"로그인"});
        });
    })(req, res, next);
});
   
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.session.destroy();
    res.redirect('/')
});

module.exports = router;