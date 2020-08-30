const SpotifyWebAPI = require('spotify-web-api-node');

const spotifyAPI = new SpotifyWebAPI({
    callbackURL: '/auth/spotify/callback',
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

spotifyAPI.setTokens = (access) => {
    spotifyAPI.setAccessToken(access.accessToken);
    spotifyAPI.setRefreshToken(access.refreshToken);
}

spotifyAPI.resetTokens = () => {
    spotifyAPI.resetAccessToken();
    spotifyAPI.resetRefreshToken();
}

module.exports = spotifyAPI;