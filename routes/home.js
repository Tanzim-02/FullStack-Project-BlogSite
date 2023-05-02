const router = require('express').Router();

const homePage = require('../controllers/Homecontroller');


router.get('/',  homePage)

module.exports= router