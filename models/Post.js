//title, body, author, tags, thumbnail, comments, likes, readTime, createdAt, updatedAt

const { Schema, model } = require('mongoose');
const Comment = require('./Comment');
const User = require('./User');

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    body: {
        type: String,
        required: true,
        maxlength: 5000
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    thumbnail: String,
    readTime: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

}, { timestamps: true })


const Post = model('Post', postSchema);

postSchema.index({ title: 'text', body: 'text', tags: 'text' }, { weights: { title: 5, body: 3, tags: 1 }});

module.exports = Post;