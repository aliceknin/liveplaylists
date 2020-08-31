const SpotifyWebAPI = require('spotify-web-api-node');

const spotifyApiParams = {
    redirectUri: '/auth/spotify/callback',
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
}

// Spotify API wrapper instance with the user's credentials
const userSpotifyAPI = new SpotifyWebAPI(spotifyApiParams);

userSpotifyAPI.setTokens = (access) => {
    userSpotifyAPI.setAccessToken(access.accessToken);
    userSpotifyAPI.setRefreshToken(access.refreshToken);
}

userSpotifyAPI.resetTokens = () => {
    userSpotifyAPI.resetAccessToken();
    userSpotifyAPI.resetRefreshToken();
}

// how do we make sure this actually uses the credentials 
// attached to the session? right now it uses the credentials
// of the most recently logged in user (which makes sense, 
// but is definitely not what we want)

// Spotify API wrapper instance with the app Spotify account's credentials
const appSpotifyAPI = new SpotifyWebAPI(spotifyApiParams);

// we've saved the refresh token for the app spotify account, which will 
// allow us to create and modify playlists on the app spotify account
// without having to manually authenticate. The refresh token is valid 
// indefinitely, or until the user (the app spotify account) deauthorizes 
// this app.

// alternative: store the refresh token in the database like any other user, 
// and get it from there instead of using an environment variable
appSpotifyAPI.setRefreshToken(process.env.APP_REFRESH_TOKEN);

// leave the access token unset for now. need to add a function that checks
// first whether the token has been set, then tries the request to see if it's 
// valid, and if not, uses the refresh token to get a new access token and 
// try the request again.

module.exports = { userSpotifyAPI, appSpotifyAPI };