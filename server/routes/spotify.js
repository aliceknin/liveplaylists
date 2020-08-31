const express = require('express');
const router = express.Router();
const { UserSpotifyAPI } = require('../config/spotify');

router.get('/user/profile', (req, res) => {
    console.log('we made it to the server');
    console.log('req.user:', req.user.dbUser.name);
    const userSpotifyAPI = UserSpotifyAPI().setTokens(req.session.access);
    userSpotifyAPI.getMe()
    .then((res) => {
        console.log('user spotify data from the spotify API');
        console.log(res.body)
    }).catch((err) => {console.log(err.message)})
});

module.exports = router;