const router = require('express').Router()
const { createPostGetController, createPostPostController, editPostGetController, editPostPostController, DeletePostGetController, postsGetController } = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware')

const postValidator = require('../validator/dashboard/post/postValidator')
const { isAuthenticated } = require('../middleware/authMiddlewar')

router.get('/create', isAuthenticated, createPostGetController)
router.post('/create', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController)

router.get('/edit/:postId', isAuthenticated, editPostGetController)
router.post('/edit/:postId', isAuthenticated, upload.single('post-thumbnail'), postValidator, editPostPostController);

router.get('/delete/:postId', isAuthenticated, DeletePostGetController);

router.get('/', isAuthenticated, postsGetController);

module.exports = router;