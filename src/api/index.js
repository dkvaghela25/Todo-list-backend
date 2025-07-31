const express = require('express');

const { userRouter } = require('./routes/user');
const { todoRouter } = require('./routes/todo');
const { authRouter } = require('./routes/auth');

const { verifyToken } = require('../middleware/authToken')

const apiRouter = express.Router();

apiRouter.use('/user', userRouter)
apiRouter.use('/todo', todoRouter)
apiRouter.use('/auth', authRouter)

module.exports = {
    apiRouter
}