const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const validator = require("email-validator");
const { client } = require('../../database/index')
const { getUsernames, getEmails } = require('../../helper/methods')
const { tokenBlacklist } = require('../../helper/constants');
const { RequestInputError, AuthenticationError } = require('../../helper/errors');
const { validate_email, validate_phone_no, validate_password } = require('../../helper/validate');

const registerUser = async (req, res) => {

    try {

        console.log(req.body)

        if (!req.body.username) {
            throw new RequestInputError('Username is required')
        }

        if (!req.body.password) {
            throw new RequestInputError('Password is required')
        }

        if (!req.body.email) {
            throw new RequestInputError('Email ID is required')
        }

        if (!req.body.phone_no) {
            throw new RequestInputError('Phone No is required')
        }

        validate_email(req.body.email)
        validate_phone_no(req.body.phone_no)
        validate_password(req.body.password)

        var image_url;

        if (!req.file) {
            image_url = 'https://res.cloudinary.com/dycqdhycj/image/upload/v1744885687/default-profile-picture_lrivmz.png';
        } else {
            try {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }).end(req.file.buffer);
                });
                image_url = result.secure_url;
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                throw new Error('Failed to upload image to Cloudinary');
            }
        }

        let users = await getUsernames();
        let emails = await getEmails();

        if (users.includes(req.body.username)) {
            return res.status(409).json({ error: true, message: 'Username is already taken' });
        } else if (emails.includes(req.body.email)) {
            return res.status(409).json({ error: true, message: 'Email ID is already in use' });
        }
        else {

            let salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(req.body.password, salt);

            let insert =
                'INSERT INTO public.users(username, password , email , phone_no, image_url) VALUES ($1, $2, $3, $4, $5)';
            let values = [req.body.username, hashPassword, req.body.email, req.body.phone_no, image_url];

            await client.query(insert, values);

            let user_id = await client.query({
                text: 'SELECT user_id FROM public.users',
                rowMode: 'array',
            });

            user_id = user_id.rows.join(' ').split(' ').map(id => Number(id));
            user_id = Math.max(...user_id)

            console.log(user_id)

            res.status(200).json({ error: false, user_id: user_id, message: 'User registered successfully' });

        }
    } catch (err) {
        res.status(err.error_code).json(err.response_data);
    }
}

const loginUser = async (req, res) => {

    try {

        if (!req.body.credentials) {
            throw new RequestInputError('Username or Email ID is required')
        }

        if (!req.body.password) {
            throw new RequestInputError('Password is required')

        }

        let credentials = req.body.credentials;


        let input_password = req.body.password;

        let isEmail = validator.validate(credentials);

        let user;

        if (isEmail) {

            emails = await getEmails();

            if (emails.includes(credentials) == false) {
                return res.status(409).json({ error: true, message: 'Invalid credentials' });
            }

            user = await client.query({
                text: `SELECT user_id,username,password FROM public.users where email = $1;`,
            }, [credentials]);

        } else {

            let users = await getUsernames();
            
            if (users.includes(credentials) == false) {
                return res.status(409).json({ error: true, message: 'Invalid credentials' });
            }

            user = await client.query({
                text: `SELECT user_id,username,password FROM public.users where username = $1;`,
            }, [credentials]);

        }

        var stored_password = user.rows[0].password
        let user_id = user.rows[0].user_id

        let match_password = await bcrypt.compare(input_password, stored_password)

        if (match_password) {

            let json = { "user_id": user_id }
            let jwtToken = jwt.sign(json, process.env.JWT_SECRET, { expiresIn: 3600 });
            return res.status(200).json({ error: false, message: 'User loggedin successfully', Token: jwtToken });

        } else {
            throw new AuthenticationError('Invalid Credentials')
        }

    }

    catch (err) {
        res.status(err.error_code).json(err.response_data);
    }

}

const logoutUser = async (req, res) => {

    let token = req.headers.authorization;

    token = token.split(' ')[1];
    console.log(token);

    tokenBlacklist.push(token)

    return res.status(200).json({ message: "User Logged out successfully" });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}