const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationError');
const User = require('../models/User');

const dashBoardController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.render('pages/dashboard/dashboard', {
        title: 'My Dashboard',
        flashMessage: Flash.getMessage(req),
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
  let errors = validationResult(req).formatWith(errorFormatter)

  let {
    name,
    title,
    bio,
    facebook,
    twitter,
    github
  } = req.body

  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
      title: 'Create Your Profile ',
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
      profile: {
        name,
        title,

        bio,
        links: {
          facebook,
          twitter,
          github
        }

      }
    });
  }



  try {
    let profile = new Profile({
      name,
      title,
      bio,

      links: {
        facebook: facebook || '',
        twitter: twitter || '',
        github: github || ''
      }
    })

    let updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    )

    // console.log(`Update-------`);
      req.flash('success', 'Profile Updated Successfully')
    res.render('pages/dashboard/edit-profile', {
      title: "Edit Profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile: updatedProfile
    })

  } catch (e) {
    next(e)
  }
};

module.exports = {
  dashBoardController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController
};
