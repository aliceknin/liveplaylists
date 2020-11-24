const express = require('express');
const router = express.Router();
const UserSpotifyAPI = require('../config/spotify');
const PlaylistCreator = require('../playlists/createPlaylist');
const { getSpotifyIDFromMusicBrainzRelURL } = require('../services/musicbrainzService');
const { getSpotifyIDFromWikiData } = require('../services/wikidataService');

router.get('/user/profile', async (req, res) => {
    // console.log('we made it to the server');
    // console.log('req.user:', req.user.name);
    // const userSpotifyAPI = new UserSpotifyAPI(req.session.access, req.user);

    // const pc = new PlaylistCreator(req.user, req.session.access);
    // const info = await pc.saveCopyOfPlaylist("2TaAnxEKQ4Kx9F7gt80e5X", "suf the fourth");
    const info = await PlaylistCreator.getPlaylistInfo("2TaAnxEKQ4Kx9F7gt80e5X");
    res.send(info);

    // userSpotifyAPI.getMe()
    // .then((res) => {
    //     console.log('user spotify data from the spotify API');
    //     console.log(res.body)
    // }).catch((err) => {console.log(err.message)})

    // userSpotifyAPI.resetAccessToken();
    // userSpotifyAPI.ensureAccessToken('getArtistAlbums', ['43ZHCT0cAZBISjO8DG9PnE'])
    // .then(data => {
    //     console.log("we're in the .then of the ensureAccessToken call");
    //     res.send(data.body);
    //     console.log('Artist albums:', data.body.items[0].name);
    // }).catch(err => console.error(err));

    // userSpotifyAPI.setRefreshTokenFromDB()
    // .then(() => {
    //     res.send();
    //     console.log("we got that from the database");
    // }).catch(err => console.error(err));

    // const mbid = "664c3e0e-42d8-48c1-b209-1efca19c0325";

    // // const musicbrainzResults = await getSpotifyIDFromMusicBrainzRelURL(mbid);
    // const wikidataResults = await getSpotifyIDFromWikiData(mbid);

    // res.send(wikidataResults);
});

module.exports = router; 