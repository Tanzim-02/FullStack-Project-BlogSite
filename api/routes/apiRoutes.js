const router = require('express').Router();

const  { isAuthenticated } = require('../../middleware/authMiddlewar');

const { commentController,replayCommentPostController } = require('../controllers/commentController');

const { likePostController, dislikePostController } = require('../controllers/likeDislikeController');

const { bookmarkPostController } = require('../controllers/bookMarksController');

router.post('/comments/:postId', isAuthenticated, commentController) 

router.post('/comments/replies/:commentId', isAuthenticated, replayCommentPostController );

router.get('/likes/:postId', isAuthenticated, likePostController);

router.get('/dislikes/:postId', isAuthenticated, dislikePostController);

router.get('/bookmarks/:postId', isAuthenticated,bookmarkPostController )


module.exports = router;