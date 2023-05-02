const Flash = require('../utils/Flash');

const readingTime = require('reading-time');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const {validationResult} = require('express-validator');
const errorFormatter = require('../utils/validationError');

const createPostGetController= (req, res, next)=>{
    res.render('pages/dashboard/post/createPost',{
        title: 'Create A new Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {}
    })

}
const createPostPostController =async (req, res, next) => {
    let { title, body, tags } = req.body; // Add tags variable

    let errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        res.render('pages/dashboard/post/createPost', {
            title: 'Create A new Post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags 
            }
        });
    }

    if(tags){
        tags = tags.split(',');
        tags = tags.map(t => t.trim());
    }

    let readTime = readingTime(body).text;

    let post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
        
    });

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        let createdPost = await post.save();
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPost._id } }
        );

        req.flash('success', 'Post Created Successfully');
        return res.redirect(`/post/edit/${createdPost._id}`);
    } catch (e) {
        next(e);
    }
};


const editPostGetController = async (req, res, next) => {
let postId = req.params.postId;


try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });
    if (!post) {
        let error = new Error(' 404 Page Not Found ');
        error.status = 404;
        throw error;
    }

    res.render('pages/dashboard/post/editPost', {
        title: 'Edit Your Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        post
    });
} 
catch (e) {
    next(e);
}
}


const editPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body; // Add tags variable
    let postId = req.params.postId;

    let errors = validationResult(req).formatWith(errorFormatter);

    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId });

        if (!post) {
            let error = new Error(' 404 Page Not Found ');
            error.status = 404;
            throw error;
        }

        if (!errors.isEmpty()) {
            res.render('pages/dashboard/post/createPost', {
                title: 'Create A new Post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
            });
        }
    
        if(tags){
            tags = tags.split(',');
            tags = tags.map(t => t.trim());
        }
        let thumbnail = post.thumbnail;

        if (req.file) {
            thumbnail = `/uploads/${req.file.filename}`;
        }

        let editedPost = await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: { title, body, tags, thumbnail } },
            { new: true }
        )

        req.flash('success', 'Post Updated Successfully');
        return res.redirect(`/post/edit/${post._id}`);
        // return res.redirect(`/post/edit/${editedPost._id}`);

    }catch(e){
        next(e);
    }
}

const DeletePostGetController = async (req, res, next) => {
    let { postId } = req.params;

    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId });

        if(!post) {
            let error = new Error(' 404 Page Not Found ');
            error.status = 404;
            throw error;
        } else {
            await Post.findOneAndDelete({ _id: post._id });
            await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { 'posts': post._id } }
            );
    
            req.flash('success', 'Post Delete Successfully');
            return res.redirect('/post');
        }

    }catch(e){
        next(e);
    }
}

const DeletePostPostController = async (req, res, next) => {
    let { postId } = req.params;
}


const postsGetController = async (req, res, next) => {
try {
    let posts = await Post.find({ author: req.user._id });

    res.render('pages/dashboard/post/posts',{
        title: 'My All Posts',
        posts,
        flashMessage: Flash.getMessage(req),
    } )



}catch (e) {
    next(e);
} }

module.exports = {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    DeletePostGetController,
    DeletePostPostController,
    postsGetController
};



