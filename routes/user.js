const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user');

//signup route
router.route('/signup')
.get(userController.renderSignupForm)//signup
.post(wrapAsync(userController.signup))

//login route
router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl ,passport.authenticate('local', {failureRedirect : '/login', 
failureFlash: true }) , wrapAsync(userController.Login))

//logout
router.get('/logout', userController.logout);

module.exports = router