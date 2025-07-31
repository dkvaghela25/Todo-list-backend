const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('./constants');
const { AuthenticationError } = require('./errors');

function decodeToken(header) {

    let token = header.split(' ')[1];

    if (tokenBlacklist.includes(token)) {
        throw new AuthenticationError('Token is blacklisted, login again');
    }

    var decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    return decodedToken;

}

module.exports = {
    decodeToken
}