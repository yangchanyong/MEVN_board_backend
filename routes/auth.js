const express = require('express');
const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const User = require('../models/member');

const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }

        return req.login(user, loginError => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});