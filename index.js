require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const db = process.env.MONGODB_DATABASE_URL;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.get ('/proof', (req, res) => {
    res.send({"test": "proof!"});
});

// in theory, heroku sets NODE_ENV to "production" by default, 
// so this should kick in when deployed there
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