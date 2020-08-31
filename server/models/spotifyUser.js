const mongoose = require('mongoose');

const spotifySchema = new mongoose.Schema({
    spotifyID: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    name: String,
    thumbURL: String,
    playlistID: String,
    playlistSettings: {
        update: {
            type: String,
            default: "never"
        }
        /* add more stuff like date range, location, genres etc.
           once you figure out what should be included in it */
    }
});

const spotifyUser = mongoose.model('SpotifyUser', spotifySchema);
module.exports = spotifyUser;