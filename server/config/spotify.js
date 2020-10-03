const SpotifyWebAPI = require('spotify-web-api-node');
const SpotifyUser = require('../models/spotifyUser');
const constants = require('./constants');

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

    getUser() {
        return this.user;
    }

    // right now, anyone who calls this has to deal with any errors 
    // that come from the function they want to call, as well as 
    // if they don't have a refresh token or refreshing the access 
    // token fails. is this ideal? should we handle some of these?
    async ensureAccessToken(funcName, args) {
        try { // await converts synchronous calls to a resolved promise, so this will always return a promise
            return await this.tryFunction(funcName, args);
        } catch(err) {
            if (err.statusCode === 401) {
                console.log("couldn't authenticate when trying to", funcName);
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
            console.log('set new access token');
            console.log('trying your function again');
            return await this.tryFunction(funcName, args);
        } catch (err) {
            // since this is just a wrapper, we want to let the original
            // caller handle any errors
            throw err;
        }
    }

    async setRefreshTokenFromDB() {
        console.log("requesting refresh token from db");
        // for some reason our decryption hook doesn't run when 
        // we use 'select', so we gotta get the whole document
        try {
            const data = await SpotifyUser.findOne({_id: this.user._id});
            const refreshToken = data.refreshToken;
            this.setRefreshToken(refreshToken);
            console.log("set refresh token: ", refreshToken)
        } catch (err) {
            // console.log(err)
            // maybe we want the error to bubble up?
            throw err;
        }
    }

    setRefreshTokenAndReturn(refreshToken) {
        this.setRefreshToken(refreshToken);
        return this;
    }

    async tryFunction(funcName, args) {
        // if no function given, call a default function
        // to check if the access token is valid
        funcName = funcName || 'getMe';
        if (typeof funcName === 'string') {
            return args ? this[funcName](...args) : this[funcName]();
        } else if (typeof funcName === 'function') {
            return args ? funcName(...args) : funcName();
        }
    }
}

module.exports = UserSpotifyAPI;