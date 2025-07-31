const { AuthenticationError } = require('../helper/errors');
const { decodeToken } = require('../helper/jwtHelper')

const authToken = (req, res, next) => {

    try {

        var decodedToken = decodeToken(req.headers.authorization);

        req.decodedToken = decodedToken;

        next();

    } catch (err) {

        if (err.name === 'TokenExpiredError') {
            err = new AuthenticationError('Token has expired');
        } else if (err.name === 'JsonWebTokenError') {
            err = new AuthenticationError('Invalid token');
        } 

        res.status(err.error_code).json(err.response_data)

    }
}

module.exports = {
    authToken
}