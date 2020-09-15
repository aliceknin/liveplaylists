const express = require('express');
const router = express.Router();
const { searchForLocation } = require('../services/songkickService');
const PlaylistCreator = require('../playlists/createPlaylist');

// do something to make sure the user is authenticated when performing playlist functions

router.get('/location', async (req, res) => {
    // search for the metro area the user wants to find upcoming concerts from which to create a playlist
    try {
        if (!req.query) {
            console.log("can't search without a query");
            res.status(400).send("400 Bad Request: can't search without a query");
        }
        const data = await searchForLocation(req.query);
        res.send(data);
        console.log("you tried to search for %O", req.query);
    } catch (err) {
        console.log('something went wrong with the location search', err);
    }
});

router.get('/create', async (req, res) => {
    // create playlist from params on the app spotify account
    try {
        console.log("attempting to create a playlist for user", req.user);
        const pc = new PlaylistCreator(req.user, req.session.access);
        const data = await pc.createLivePlaylist(req.query);
        res.send(data);
        console.log("finished creating playlist");
    } catch (err) {
        console.log("couldn't create playlist", err);
    }
});

router.post('/save', (req, res) => {
    // save a copy of the given playlist to the logged in user's spotify account
});

router.post('/auto-creation-params', (req, res) => {
    // set logged in user's automatic playlist creation params
});

module.exports = router;