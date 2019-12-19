const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

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
        console.log("-------------------------------");
        console.log("spotify redirect");
        console.log(`req.user: ${req.user}`);
        console.log('passport session user: %O', req.session.passport.user);
        res.redirect('/user')
    });

app.get('/auth/user', (req, res) => {
    console.log("-------------------------------");
    console.log("getting user info for the front end")
    if (req.user) {
        console.log('req.user: %O', req.user);
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
    console.log("req.user: %O", req.user);
    console.log("passport session user: %O", req.session.passport.user);
    res.send("logged out");
});

// heroku sets NODE_ENV to "production" by default, 
// so this kicks in when deployed there
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send("yo");
    });
}

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});