const User = require('../models/User')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const errorFOrmater = require('../utils/validationError')
const Flash = require('../utils/Flash')


exports.signupGetController = (req, res, next) => {
  res.render('pages/auth/signup', {
    title: 'Create A New Account',
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req)
  })
}


exports.signupPostController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Run the validation middleware
    const errors = validationResult(req).formatWith(errorFOrmater);

    if (!errors.isEmpty()) {
      req.flash('failed', 'Please Check your Form..!')
      
      return res.render('pages/auth/signup', {
        title: 'Create A New Account',
        error: errors.mapped(),
        value: {
          username,
          email,
          password,
        },
        flashMessage: Flash.getMessage(req)
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 11);

    // Create the user object
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
   await user.save();

   req.flash('success', "User Created Successfully..")


    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
};

exports.loginGetController = (req, res, next) => {

  res.render('pages/auth/login', {
    title: 'Login Your Account',
    error: {},
    flashMessage: Flash.getMessage(req)
  });
};

exports.loginPostController = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    const errors = validationResult(req).formatWith(errorFOrmater);

    
    if (!errors.isEmpty()) {
      req.flash('failed', 'Please Check your Form..!')

      return res.render('pages/auth/login', {
        title: 'Login Your Account',
        error: errors.mapped(),
        flashMessage: Flash.getMessage(req)
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      req.flash('failed', 'Please Provide Valid Credentials.')
      return res.render('pages/auth/login', {
        title: 'Login Your Account',
        error: {},
        flashMessage: Flash.getMessage(req)
      });
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('failed', 'Please Provide Valid Credentials.')
      return res.render('pages/auth/login', {
        title: 'Login Your Account',
        error: {},
        flashMessage: Flash.getMessage(req)
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save((err) => {
      if (err) {
      
        return next(err);
      }
      req.flash('success', 'Successfully Logedin.....')
      res.redirect('/dashboard');
    });
  } catch (e) {

    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    else {
    return res.redirect('/auth/login');
    }
  });
};
