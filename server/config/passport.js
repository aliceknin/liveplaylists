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

function modifyUserForPassport(user, profile) {
    let modifiedUser = user;
    modifiedUser.profile = profile._json;
    return modifiedUser;
}

function findOrCreateUser(profile, done) {
    SpotifyUser.findOne({spotifyID: profile.id}, (err, returnedUser) => {
        if (returnedUser) {
            // user is already in the db
            let modifiedUser = modifyUserForPassport(returnedUser, profile);
            console.log("Existing Spotify user: %O", modifiedUser);
            done(err, modifiedUser); // doesn't matter if we return the result because no one does anything with it
        } else {
            // user isn't in the db, so we gotta create one
            new SpotifyUser(getDbUserParams(profile)).save()
            .then(newUser => {
                let modifiedUser = modifyUserForPassport(newUser, profile);
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
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            passReqToCallback: true
        }, (req, accessToken, refreshToken, expires_in, profile, done) => {           
            let access = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expires_in: expires_in
            }
            req.session.access = access;
            findOrCreateUser(profile, done);
        })
    );

    passport.serializeUser((user, done) => {
        console.log("serializing user!");
        done(null,  {id: user.id, profile: user.profile});
    });''

    passport.deserializeUser((params, done) => {
        SpotifyUser.findById(params.id, (err, user) => {
            if (user) {
                let passportUser = {
                    dbUser: user,
                    profile: params.profile
                }
                console.log("deserializing user!");
                done(err, passportUser);
            } else {
                done(err, user);
            }
        });
    });

}