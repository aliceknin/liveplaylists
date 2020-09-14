const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyUser = require('../models/spotifyUser');

function getDbUserParams(spotifyProfile, refreshToken) {
    let userParams = {
        name: spotifyProfile.displayName,
        spotifyID: spotifyProfile.id,
        refreshToken: refreshToken
    };
    return userParams;
}

function modifyUserForPassport(user, profile) {
    let modifiedUser = user.toJSON();
    if (profile.photos && profile.photos.length > 0) {
        modifiedUser.thumbURL = profile.photos[0];
    }
    modifiedUser.product = profile.product;
    return modifiedUser;
}

function updateUserForPassport(user, profile, refreshToken) {
    let userUpdates = {};
    if (user.name !== profile.displayName) {
        userUpdates.name = profile.displayName;
    }
/* this update was originally to update the old users to include the
    new attribute, but I should also look into whether it's best 
    practice to update refreshTokens (like, do old ones eventually 
    expire if you get issued enough new ones) */
    return SpotifyUser.updateRefreshToken(user._id, refreshToken, userUpdates)
    .then((updatedUser) => {
        if (updatedUser) {
            console.log("updated user refresh token in the db");
            return updatedUser;
        } else {
            console.log('update refresh token returned neither a user nor an error');
            return user;
        }
    }, (err) => {
        console.log('update refresh token failed :(');
        console.log(err);
        return user;
    });
} 

function findOrCreateUser(profile, refreshToken) {
    return SpotifyUser.findOne({spotifyID: profile.id})
    .then((foundUser) => {
        if (foundUser) {
            return updateUserForPassport(foundUser, profile, refreshToken)
            .then((updatedUser) => {
                console.log("Existing Spotify user:");
                return updatedUser;
            });
        } else {
            return new SpotifyUser(getDbUserParams(profile, refreshToken)).save()
            .then(newUser => {
                console.log("New Spotify user:");
                return newUser;
            });
        }
    });
}

function getUserForPassport(profile, refreshToken, done) {
    findOrCreateUser(profile, refreshToken)
    .then((user) => {
        let passportUser = modifyUserForPassport(user, profile);
        console.log("got user for passport", passportUser);
        done(null, passportUser);
    }, (err) => {
        done(err, null);
    });
}

const config = (passport) => {

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
            getUserForPassport(profile, refreshToken, done);
        })
    );

    passport.serializeUser((user, done) => {
        console.log("serializing user!");
        done(null,  { id: user._id, profile: {
            photos: user.thumbURL ? [user.thumbURL] : null,
            product: user.product
        }});
    });

    passport.deserializeUser((params, done) => {
        SpotifyUser.findById(params.id, (err, user) => {
            if (user) {
                let passportUser = modifyUserForPassport(user, params.profile);
                console.log("deserializing user!");
                done(err, passportUser);
            } else {
                done(err, user);
            }
        });
    });

}

module.exports = { 
    config,
    getDbUserParams,
    modifyUserForPassport,
    updateUserForPassport,
    findOrCreateUser,
    getUserForPassport
 };

 /*
 note: after the refactor of the getUserForPassport flow, 
 it takes noticeably longer to load the user data. perhaps
 it's because there are more .thens or something. 
 */