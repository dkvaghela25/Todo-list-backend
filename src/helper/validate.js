const { phone } = require('phone');
const validator = require("email-validator");
var passwordValidator = require('password-validator');
const { ValidationError } = require('./errors');

const validate_email = (email) => {

    let valid_email = validator.validate(email);

    if (!valid_email) {
        throw new ValidationError('Invalid Email ID')
    }

}

const validate_phone_no = (phone_no) => {

    let valid_phone_no = phone(phone_no, { country: 'IND' });

    if (!valid_phone_no.isValid) {
        throw new ValidationError('Invalid Phone No')
    }

}

var schema = new passwordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces 

const validate_password = (password) => {
    let valid_password = schema.validate(password);

    if (!valid_password) {
        throw new ValidationError('Password must be at least 8 characters, include 2 digits, 1 uppercase letter, 1 lowercase letter, and no spaces.')
    }
}

module.exports = {
    validate_email,
    validate_phone_no,
    validate_password
}