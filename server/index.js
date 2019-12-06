const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();
const PORT = 4000;

const db = keys.mongo.dbURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("yo");
});

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});