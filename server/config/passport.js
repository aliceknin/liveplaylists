const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyUser = require('../models/spotifyUser');

function getDbUserParams(spotifyProfile) {
    let userParams = {
        name: spotifyProfile.displayName,
        spotifyID: spotifyProfile.id
    };
    if (spotifyProfile.photos && spotifyProfile.photos.length > 0) {
        userParams.thumbURL = spotifyProfile.photos[0];
    }
    return userParams;
}

function modifyUserForPassport(user, profile, access) {
    let modifiedUser = user;
    modifiedUser.profile = profile._json;
    modifiedUser.access = access;
    return modifiedUser;
}

function findOrCreateUser(spotifyUser, profile, access, done) {
    spotifyUser.findOne({spotifyID: profile.id}, (err, returnedUser) => {
        if (returnedUser) {
            // user is already in the db
            let modifiedUser = modifyUserForPassport(returnedUser, profile, access);
            console.log("Existing Spotify user: %O", modifiedUser);
            done(err, modifiedUser);
        } else {
            // user isn't in the db, so we gotta create one
            new SpotifyUser(getDbUserParams(profile)).save()
            .then(newUser => {
                let modifiedUser = modifyUserForPassport(newUser, profile, access);
                console.log("New Spotify user: %O", modifiedUser);
                done(err, modifiedUser);
            })
        }
    });
}

module.exports = (passport) => {

    passport.use(
        new SpotifyStrategy({
            callbackURL: '/auth/spotify/callback',
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        }, (accessToken, refreshToken, expires_in, profile, done) => {           
            let access = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expires_in: expires_in
            }

            findOrCreateUser(SpotifyUser, profile, access, done);
        })
    );

    passport.serializeUser((user, done) => {
        console.log("serializing user!");
        done(null,  {id: user.id, profile: user.profile, access: user.access});
    });''

    passport.deserializeUser((params, done) => {
        SpotifyUser.findById(params.id, (err, user) => {
            if (user) {
                let passportUser = {
                    dbUser: user,
                    profile: params.profile,
                    access: params.access
                }
                console.log("deserializing user!");
                done(err, passportUser);
            } else {
                done(err, user);
            }
        });
    });

}