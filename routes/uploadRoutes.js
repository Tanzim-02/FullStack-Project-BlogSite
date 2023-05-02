const router = require('express').Router();

const {isAuthenticated} = require('../middleware/authMiddlewar');

const upload = require('../middleware/uploadMiddleware');

const  {uploadProfilePics,removeProfilePics,postImageUploadController
 } =require('../controllers/UploadController')

router.post('/profilePics',isAuthenticated,upload.single('profilePics') ,uploadProfilePics )
 

router.delete('/profilePics', isAuthenticated, removeProfilePics)

router.post('/postimage', isAuthenticated, upload.single('post-image'), postImageUploadController)

module.exports= router;