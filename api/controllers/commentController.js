const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

const commentController = async (req, res, next) => {
    let { postId } = req.params;

    let {body} = req.body;

    if(!req.user) {
        return res.status(401).json({error: 'You must be logged in to comment'});
    }

    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try{

        let createdComment = await comment.save();
    await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: createdComment._id } }
    )

    let commentJSON = await Comment.findById(createdComment._id).populate({
        path: 'user',
        select: 'username profilePics'
    }).exec();

    return res.status(201).json(commentJSON);

    }catch(e) {
        console.log(e);
        return res.status(500).json({error: 'Server Error Occured'});
    }


}

module.exports = commentController;