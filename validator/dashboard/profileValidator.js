const { body }= require('express-validator');
const User =require('../../models/User');
const  validator = require('validator')

const urlValidator = value=> {
    if(value) {
        if(!validator.isURL(value)) {
            throw new Error ('Please Provide Valid URL')
        }
    }
    return true;
   
}

module.exports = [
    body('name')
    .not().isEmpty().withMessage('Name Can Not Be Empty').isLength({max:32}).withMessage('Name Can not Be More Than 32 Chars').trim(),

    body('title')
    .not().isEmpty().withMessage('Title Can Not Be Empty').isLength({max:100}).withMessage('Title Can not Be More Than 100 Chars').trim(),


    body('bio')
    .not().isEmpty().withMessage('Bio Can Not Be Empty').isLength({max:500}).withMessage('Bio Can not Be More Than 500 Chars').trim(),

    body('website')
    .custom(urlValidator),


    body('facebook')
    .custom(urlValidator),

    body('twitter')
    .custom(urlValidator),
    body('github')
    .custom(urlValidator),
    
]



