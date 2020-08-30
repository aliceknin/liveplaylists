const express = require('express');
const router = express.Router();
// please decide on an http request library (https, node-fetch, axios, superagent)

/*
Songkick API request URLs

Location search:
    https://api.songkick.com/api/3.0/search/locations.json?query={search_query}&apikey={your_api_key}
Metro Area Calendar search:
    https://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json?apikey={your_api_key}
*/

router.get('/location:search_str', (req, res) => {
    // search for the metro area the user wants to find upcoming concerts from which to create a playlist
});

router.get('/create', (req, res) => {
    // create playlist from params on the app spotify account
});

router.get('/save', (req, res) => {
    // save a copy of the given playlist to the logged in user's spotify account
});

router.get('/auto-creation-params', (req, res) => {
    // set logged in user's automatic playlist creation params
});

module.exports = router;