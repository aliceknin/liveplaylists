const express = require('express');
const router = express.Router();
const spotifyAPI = require('../config/spotify');

router.get('/user/profile', (req, res) => {
    console.log('we made it to the server');
    spotifyAPI.getMe()
    .then((res) => {
        console.log('user spotify data from the spotify API');
        console.log(res.body)
    }).catch((err) => {console.log(err.message)})
});

router.get('/test', (req, res) => {
    console.log('spotify api obj test:', spotifyAPI.test);
    console.log('route test complete');
});

module.exports = router;