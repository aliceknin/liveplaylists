const SpotifyWebAPI = require('spotify-web-api-node');

/**
 * Wrapper for the SpotifyWebAPI with the app client creds;
 * keeps a reference to the user it's using for authentication
 */
class UserSpotifyAPI extends SpotifyWebAPI {
    constructor(access, user) {
        super({
            redirectUri: '/auth/spotify/callback',
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        });

        if (access) {
            this.setTokens(access);
        }
        if (user) {
            this.setUser(user);
        }
    }

    setTokens(access) {
        this.setAccessToken(access.accessToken);
        this.setRefreshToken(access.refreshToken);
        return this;
    }

    setUser() {
        this.user = user;
        return this;
    }

}

// Spotify API wrapper instance with the app Spotify account's credentials
const appSpotifyAPI = new UserSpotifyAPI();

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

module.exports = { UserSpotifyAPI, appSpotifyAPI };