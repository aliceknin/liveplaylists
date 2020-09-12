const express = require('express');
const router = express.Router();
const passport = require('passport');

function removeRefreshToken(reqUser) {
    let frontEndUser = { ...reqUser };
    delete frontEndUser.refreshToken;
    delete frontEndUser.__enc_refreshToken;
    console.log('frontEndUser: %O', frontEndUser);
    return frontEndUser;
}

router.get('/spotify', passport.authenticate('spotify', {
    scope: [
        'user-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-modify-private'
    ],
    showDialog: true
}));

router.get('/spotify/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log("-------------------------------");
        console.log("spotify redirect");
        console.log('req.user: %O', req.user);
        console.log('passport session user: %O', req.session.passport.user);
        res.redirect('/user')
});

router.get('/user', (req, res) => {
    console.log("-------------------------------");
    console.log("getting user info for the front end")
    if (req.user) {
        console.log('req.user: %O', req.user);
        console.log('req.session: %O', req.session);
        console.log('passport session user: %O', req.session.passport.user);
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
    console.log("passport session user: %O", req.session.passport.user);
    req.session.destroy((err) => {
        res.send('logged out');
    });
    console.log("req.user: %O", req.user);
    console.log('req.session: %O', req.session);
});

module.exports = router;