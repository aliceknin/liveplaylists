const mongoose = require('mongoose');
const { fieldEncryption } = require('mongoose-field-encryption');

const SpotifySchema = new mongoose.Schema({
    spotifyID: {
        type: String,
        required: true,
        immutable: true,
        unique: true
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


const secret = process.env.MONGOOSE_FIELD_SECRET;
SpotifySchema.plugin(fieldEncryption, 
    { fields: ["refreshToken"], secret } );

const SpotifyUser = mongoose.model('SpotifyUser', SpotifySchema);

SpotifyUser.updateRefreshToken = (id, refreshToken, callback) => {
    return SpotifyUser.findOneAndUpdate(
        { _id: id },
        { $set: { refreshToken, __enc_refreshToken: false } },
        callback
    );
}

module.exports = SpotifyUser;