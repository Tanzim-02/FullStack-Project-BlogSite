const router = require('express').Router();
const {dashBoardController,
    createProfileGetController,
       createProfilePostController,
       editProfileGetController,
       bookmarksGetController,
       editProfilePostController,
    commentgetController} = require('../controllers/dashboardController');
const profileValidator = require('../validator/dashboard/profileValidator')

const {isAuthenticated} = require('../middleware/authMiddlewar')


router.get('/bookmarks',isAuthenticated, bookmarksGetController)
router.get('/comments',isAuthenticated, commentgetController)

router.get('/create-profile',isAuthenticated, createProfileGetController )
router.post('/create-profile',isAuthenticated, profileValidator, createProfilePostController )

router.get('/edit-profile',isAuthenticated, editProfileGetController)
router.post('/edit-profile',isAuthenticated,profileValidator, editProfilePostController)

router.get('/',isAuthenticated ,dashBoardController)
module.exports= router