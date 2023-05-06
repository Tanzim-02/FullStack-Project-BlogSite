const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationError');
const User = require('../models/User');

const dashBoardController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate({
      path: 'posts',
      select: 'title thumbnail'
    })
      .populate({
        path: 'bookmarks',
        select: 'title thumbnail'
      })

    if (profile) {


      return res.render('pages/dashboard/dashboard', {
        title: 'My Dashboard',
        flashMessage: Flash.getMessage(req),
        posts: profile.posts.reverse().slice(0, 3),
        bookmarks: profile.bookmarks.reverse().slice(0, 3)

      });
    }

    res.redirect('/dashboard/create-profile');
  } catch (e) {
    next(e);
  }
};

const createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      res.redirect('/dashboard/edit-profile');
    }

    res.render('pages/dashboard/create-profile', {
      title: 'Create Your Profile',
      flashMessage: Flash.getMessage(req),
      error: {}
    });
  } catch (e) {
    next(e);
  }
};

const createProfilePostController = async (req, res, next) => {

  let errors = validationResult(req).formatWith(errorFormatter)
  console.log(errors.mapped());
  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
      title: 'Create Your Profile ',
      flashMessage: Flash.getMessage(req),
      error: errors.mapped()
    });
  }

  let {
    name,
    title,
    bio,
    facebook,
    twitter,
    github
  } = req.body



  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        facebook: facebook || '',
        twitter: twitter || '',
        github: github || ''
      },
      posts: [],
      bookmarks: []
    })

    let createdProfile = await profile.save()

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createdProfile._id } }
    )

    req.flash('success', 'Profile Created Successfully...')
    res.redirect('/dashboard')

  } catch (e) {
    next(e)
  }



};

const editProfileGetController = async (req, res, next) => {

  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      res.redirect('/dashboard/create-profile')
    }
    res.render('pages/dashboard/edit-profile', {
      title: "Edit Profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile
    })

  } catch (e) {
    next(e);
  }
};

const editProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);

  let {
    name,
    title,
    bio,
    facebook,
    twitter,
    github
  } = req.body;

  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/edit-profile', {
      title: 'Edit Profile',
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: {
          facebook: facebook || '',
          twitter: twitter || '',
          github: github || ''
        }
      }
    });
  }

  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      res.redirect('/dashboard/create-profile');
    }

    profile.name = name;
    profile.title = title;
    profile.bio = bio;
    profile.links = {
      facebook: facebook || '',
      twitter: twitter || '',
      github: github || ''
    };

    let updatedProfile = await profile.save();

    req.flash('success', 'Profile Updated Successfully');
    res.render('pages/dashboard/edit-profile', {
      title: 'Edit Profile',
      error: {},
      flashMessage: Flash.getMessage(req),
      profile: updatedProfile
    });

  } catch (e) {
    next(e);
  }
};


const bookmarksGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate({
        path: 'bookmarks',
        model: 'Post',
        select: 'title thumbnail'
      })
      .populate({
        path: 'user',
        model: 'User',
        select: 'username profilePics'
      })

    res.render('pages/dashboard/bookmarks', {
      title: 'My Bookmarks',
      flashMessage: Flash.getMessage(req),
      posts: profile.bookmarks
    })
  } catch (e) {
    next(e)
  }
}


const commentgetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
    let comments = await Comment.find({ post: { $in: profile.posts } })
      .populate({
        path: 'post',
        select: 'title'
      })
      .populate({
        path: 'user',
        select: 'username profilePics'
      })
      .populate({
        path: 'replies.user',
        select: 'username profilePics'
      })

    // res.json(comments)
    res.render('pages/dashboard/comments', {
      title: 'My Recent Comments',
      flashMessage: Flash.getMessage(req),
      comments
    })

  } catch (e) {
    next
  }
}

module.exports = {
  dashBoardController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarksGetController,
  commentgetController
};
