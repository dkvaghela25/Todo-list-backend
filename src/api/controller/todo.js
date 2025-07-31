const { client } = require('../../database/index');
const { AuthenticationError, RequestInputError } = require('../../helper/errors');
const { verifyToken } = require('../../helper/jwtHelper');

const addTask = async (req, res) => {

    try {

        if(!req.body.title){
            throw new RequestInputError('Title is required')
        }
        
        if(!req.body.description){
            throw new RequestInputError('Description is required')
        }
        
        let user_id = req.decodedToken.user_id
        
        const query = 'INSERT INTO public.todo(user_id, title, description) VALUES ($1, $2, $3)'
        
        await client.query(query, [user_id, req.body.title, req.body.description])

        return res.status(200).json({ message: 'Task added successfully' });

    } catch (err) {
        res.status(err.error_code).json(err.response_data)
    }

}

const updateTask = async (req, res) => {

    try {

        console.log('1')
        
        let change_in = Object.keys(req.body);
        let todo_id = req.params.todo_id;
        console.log('2')
        
        let user_id = await client.query('select user_id from public.todo where todo_id = $1' , [todo_id]);
        console.log('3')
        
        if (user_id.rows.length == 0) {
            console.log('4')
            return res.status(200).json({message : 'Task not found'})
        } else if (user_id.rows[0].user_id != req.decodedToken.user_id) {
            console.log('5')
            throw new AuthenticationError('Wrong ID')
        }
        
        console.log('6')

        change_in.forEach(element => {
            let query = `UPDATE public.todo SET ${element} = $1 WHERE todo_id = $2;`
            client.query(query, [req.body[element], todo_id])
        });

        return res.status(200).json({ message: "Task updated succesfully" });

    } catch (err) {
        res.status(err.error_code).json(err.response_data)
    }

}

const deleteTask = async (req, res) => {

    try {

        let todo_id = req.params.todo_id
        let user_id = await client.query('select user_id from public.todo where todo_id = $1' , [todo_id]);

        if (user_id.rows.length == 0) {
            return res.status(200).json({message : 'Task not found'})
        } else if (user_id.rows[0].user_id != req.decodedToken.user_id) {
            throw new AuthenticationError('Wrong ID')
        }

        await client.query('DELETE FROM public.todo WHERE todo_id = $1;', [todo_id])

        return res.status(200).json({ message: "Task deleted succesfully" });

    } catch (err) {
        res.status(err.error_code).json(err.response_data)
    }

}

const showTask = async (req, res) => {

    try {

        let user_id = req.decodedToken.user_id

        let tasks = await client.query('SELECT * FROM public.todo where user_id = $1;', [user_id]);

        if (tasks.rows.length == 0) {
            return res.status(200).json({ message: "No task for user" });
        }

        res.send(tasks.rows)

    } catch (err) {
        res.status(err.error_code).json(err.response_data)
    }

}

module.exports = {
    addTask,
    updateTask,
    deleteTask,
    showTask
}