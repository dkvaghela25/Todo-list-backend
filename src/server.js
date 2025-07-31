const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const { connect } = require('./database/index')
const { apiRouter } = require('./api/index');
const { cloudinaryConfig } = require('./helper/cloudinary');

dotenv.config()

const app = express();
const port = process.env.PORT;

connect();
cloudinaryConfig();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.get('/health', function (req, res) {
    return res.send('Ok, Working fine.');
});

app.use('/', apiRouter)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`)
})

module.exports = app;