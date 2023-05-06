const { body } = require('express-validator');
const User = require('../../models/User');


const signupValidator = [
    body('username')
        .isLength({ min: 2, max: 15 }).withMessage('Username must be between 2 and 15 characters')
        .custom(async username => {
            console.log('custom validation for username called');
            let user = await User.findOne({ username });

            if (user) {
                return Promise.reject('Username already taken')
            }
        }).trim(),

    body('email')
        .isEmail().withMessage('Please provide a valid email address')
        .custom(async email => {
            let user = await User.findOne({ email });

            if (user) {
                return Promise.reject('Username already taken')
            }
        }).normalizeEmail(),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true;
        })
]


module.exports = signupValidator;