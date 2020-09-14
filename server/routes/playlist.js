const express = require('express');
const router = express.Router();
const axios = require('axios');

SONGKICK_API_URL = 'https://api.songkick.com/api/3.0/'; 
// do something to make sure the user is authenticated when performing playlist functions

/*
Songkick API request URLs

Location search:
    https://api.songkick.com/api/3.0/search/locations.json?query={search_query}&apikey={your_api_key}
Metro Area Calendar search:
    https://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json?apikey={your_api_key}
*/

router.get('/location', (req, res) => {
    // search for the metro area the user wants to find upcoming concerts from which to create a playlist
    if (!req.query) {
        console.log("can't search without a query");
        res.status(400).send("400 Bad Request: can't search without a query");
    } else {
        axios.get(SONGKICK_API_URL + 'search/locations.json', {
            params: {
                ...req.query,
                apikey: process.env.SONGKICK_API_KEY
            }
        }).then(apiRes => {
            res.send(apiRes.data);
            console.log("you tried to search for %O", req.query);
        }).catch(err => {
            console.log('something went wrong with the songkick api location search', err);
        });
    }
});

router.post('/create', (req, res) => {
    // create playlist from params on the app spotify account
    console.debug('testing out this debug thing');
});

router.post('/save', (req, res) => {
    // save a copy of the given playlist to the logged in user's spotify account
});

router.post('/auto-creation-params', (req, res) => {
    // set logged in user's automatic playlist creation params
});

module.exports = router;