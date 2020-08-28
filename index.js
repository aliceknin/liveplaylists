const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const SpotifyWebAPI = require('spotify-web-api-node');

require('dotenv').config();
require('./server/config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 4000;

// configure and connect to database
const db = process.env.MONGODB_DATABASE_URL;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));


// spotify web api config, hopefully to be moved out when I refactor
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

app.use(cors());

// body parser
app.use(express.json());

app.use(session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.get ('/proof', (req, res) => {
    res.send({"test": "proof!"});
});

app.get('/auth/spotify', passport.authenticate('spotify', {
        scope: [
            'user-read-private',
            'playlist-read-collaborative',
    '            playlist-modify-public',
            'playlist-read-private',
            'playlist-modify-private'
        ],
        showDialog: true
    }));

app.get('/auth/spotify/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/'
    }),
    (req, res) => {
        spotifyAPI.setTokens(req.session.access);
        console.log("-------------------------------");
        console.log("spotify redirect");
        console.log(`req.user: ${req.user}`);
        console.log('passport session user: %O', req.session.passport.user);
        console.log('spotifyAPI: %O', spotifyAPI);
        res.redirect('/user')
    });

app.get('/auth/user', (req, res) => {
    console.log("-------------------------------");
    console.log("getting user info for the front end")
    if (req.user) {
        console.log('req.user: %O', req.user);
        console.log('req.session: %O', req.session);
        console.log('passport session user: %O', req.session.passport.user);
        res.json(req.user);
    } else {
        console.log('no user here')
        res.send({});
    }
});

app.get('/auth/logout', (req, res) => {
    console.log("-------------------------------");
    console.log("tryna log out");
    req.logout();
    console.log("passport session user: %O", req.session.passport.user);
    req.session.destroy((err) => {
        spotifyAPI.resetTokens();
        res.send('logged out');
    });
    console.log("req.user: %O", req.user);
    console.log('req.session: %O', req.session);
    ;
});

app.get('/spotify/user/profile', (req, res) => {
    console.log('we made it to the server');
    spotifyAPI.getMe()
    .then((res) => {
        console.log('user spotify data from the spotify API');
        console.log(res.body)
    }).catch((err) => {console.log(err.message)})
});

// heroku sets NODE_ENV to "production" by default, 
// so this kicks in when deployed there
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    });
    // heroku uses https, so this will make passport use 
    // https during spotify auth
    app.enable('trust proxy') ;
} else {
    app.get('/', (req, res) => {
        res.send("yo");
    });
}

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});