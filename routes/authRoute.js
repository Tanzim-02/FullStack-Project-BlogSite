const router = require('express').Router();


const {loginGetController,loginPostController,logoutController,signupGetController,signupPostController} = require('../controllers/authController');

const signupValidator = require('../validator/auth/signupValidator');
const loginValidator = require('../validator/auth/loginValidator');
const {isUnAuthnticated} = require('../middleware/authMiddlewar')




router.get('/signup',isUnAuthnticated,signupGetController );
router.post('/signup',isUnAuthnticated,signupValidator,signupPostController );

router.get('/login',isUnAuthnticated,loginGetController );
router.post('/login',isUnAuthnticated,loginValidator,loginPostController );

router.get('/logout',logoutController );

module.exports = router;