const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');

require('dotenv').config();
require('./server/config/passport').config(passport);

const app = express();
const PORT = process.env.PORT || 4000;

// configure and connect to database
const db = process.env.MONGODB_DATABASE_URL;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // default index creation uses 'ensureIndex' which is deprecated
    useFindAndModify: false // using findOneAndUpdate without this is deprecated
})
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

app.use(cors());

// body parser
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get ('/proof', (req, res) => {
    res.send({"test": "proof!"});
});

app.use('/auth', require('./server/routes/auth'));
app.use('/playlist', require('./server/routes/playlist'));
app.use('/spotify', require('./server/routes/spotify'));

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