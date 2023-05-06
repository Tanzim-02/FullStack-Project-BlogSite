const { body } = require('express-validator');
const User = require('../../models/User');


module.exports = [
    body('email')
        .not().normalizeEmail().isEmpty().withMessage('Please provide a valid email address'),

    body('password')
        .not().isEmpty().withMessage('Password can"t be empty')
]