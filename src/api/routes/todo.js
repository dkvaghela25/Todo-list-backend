const express = require('express');
const multer = require('multer');
const todo = require('../controller/todo');
const { authToken } = require('../../middleware/authToken');


const todoRouter = express.Router();

const upload = multer();

todoRouter.use(authToken);

todoRouter.get('/', todo.showTask)
todoRouter.post('/create', upload.none() , todo.addTask)
todoRouter.patch('/update/:todo_id', upload.none() , todo.updateTask)
todoRouter.delete('/delete/:todo_id', todo.deleteTask)

module.exports = {
    todoRouter
}