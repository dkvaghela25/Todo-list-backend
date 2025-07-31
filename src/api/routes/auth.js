const express = require('express');
const multer = require('multer');
const auth = require('../controller/auth')
const { validate_user } = require('../../helper/validate')

const authRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRouter.use(express.urlencoded({ extended: false }));

authRouter.post('/register',upload.single('image'), auth.registerUser)
authRouter.post('/login', upload.none(), auth.loginUser)
authRouter.post('/logout', auth.logoutUser)

module.exports = {
    authRouter
}