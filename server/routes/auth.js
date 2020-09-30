const express = require('express');
const router = express.Router();
const passport = require('passport');
const { SCOPES } = require('../config/constants');

function removeRefreshToken(reqUser) {
    let frontEndUser = { ...reqUser };
    delete frontEndUser.refreshToken;
    delete frontEndUser.__enc_refreshToken;
    return frontEndUser;
}

router.get('/spotify', passport.authenticate('spotify', {
    scope: SCOPES
}));

router.get('/spotify/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log("spotify redirect");
        res.redirect('/');
});

router.get('/user', (req, res) => {
    console.log("-------------------------------");
    console.log("getting user info for the front end")
    if (req.user) {
        console.log('req.user: %O', req.user);
        res.json(removeRefreshToken(req.user));
    } else {
        console.log('no user here')
        res.send({});
    }
});

router.get('/logout', (req, res) => {
    console.log("-------------------------------");
    console.log("tryna log out");
    req.logout();
    req.session.destroy((err) => {
        res.send('logged out');
    });
    console.log("req.user: %O", req.user);
    console.log('req.session: %O', req.session);
});

router.get('/switch_user', passport.authenticate('spotify', {
    scope: SCOPES,
    showDialog: true
}));

module.exports = router;