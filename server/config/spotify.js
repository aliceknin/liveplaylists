const SpotifyWebAPI = require('spotify-web-api-node');
const SpotifyUser = require('../models/spotifyUser');

/**
 * Wrapper for the SpotifyWebAPI with the app client creds;
 * keeps a reference to the user it's using for authentication
 */
class UserSpotifyAPI extends SpotifyWebAPI {
    constructor(access, user) {
        super({
            redirectUri: '/auth/spotify/callback',
            clientId: process.env.SPOTIFY_CLIENT_ID,
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

    setUser(user) {
        this.user = user;
        return this;
    }

    // right now, anyone who calls this has to deal with any errors 
    // that come from the function they want to call, as well as 
    // if they don't have a refresh token or refreshing the access 
    // token fails. is this ideal? should we handle some of these?
    async ensureAccessToken(funcName, args) {
        try { // await converts synchronous calls to a resolved promise, so this will always return a promise
            return await this[funcName](...args);
        } catch(err) {
            if (err.statusCode === 401) {
                console.log("couldn't authenticate");
                return this.tryWithNewAccessToken(funcName, args);
            } else {
                // let the original caller handle non-auth errors
                throw err;
            }
        } 
    }

    async tryWithNewAccessToken(funcName, args) {
        if (!this.getRefreshToken()) {
            console.log("couldn't find a refresh token");
            await this.setRefreshTokenFromDB();
        }
        try {
            console.log("requesting new access token");
            const data = await this.refreshAccessToken();
            this.setAccessToken(data.body['access_token']);
            console.log('set new access token:', data.body['access_token']);
            console.log('trying your function again');
            return await this[funcName](...args);
        } catch (err) {
            // since this is just a wrapper, we want to let the original
            // caller handle any errors
            throw err;
        }
    }

    setRefreshTokenFromDB() {
        console.log("requesting refresh token from db");
        // for some reason our decryption hook doesn't run when 
        // we use 'select', so we gotta get the whole document
        return SpotifyUser.findOne({_id: this.user.dbUser._id})
        .then(data => {
            const refreshToken = data.refreshToken;
            this.setRefreshToken(refreshToken);
            console.log("set refresh token: ", refreshToken)
        }) // maybe we want the error to bubble up?
        // .catch(err => console.log(err));
    }
}

// Spotify API wrapper instance with the app Spotify account's credentials
const appSpotifyAPI = new UserSpotifyAPI();

// we've saved the refresh token for the app spotify account, which will 
// allow us to create and modify playlists on the app spotify account
// without having to manually authenticate. The refresh token is valid 
// indefinitely, or until the user (the app spotify account) deauthorizes 
// this app.

// we read it here from an env variable so we don't necessarily have to 
// get it from the database, but if we needed to, we could just use the
// setRefreshTokenFromDB method.
appSpotifyAPI.setRefreshToken(process.env.APP_REFRESH_TOKEN);

// leave the access token unset for now; if we need to call a function that
// needs access, we can just use the ensureAccessToken method.

module.exports = { UserSpotifyAPI, appSpotifyAPI };