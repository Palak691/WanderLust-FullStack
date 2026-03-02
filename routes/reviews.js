const express = require('express');
const router = express.Router({mergeParams : true});// parent route 
const Reviews = require("../models/reviews.js")

const wrapAsync = require('../utils/wrapAsync');//error handline utilites
const ExpressErr = require('../utils/ExpressErr.js');
const {listingSchema , reviewSchema} = require('../Schema.js');//listings
const Listing = require('../models/listing');
const { validateReview, isloggedin, isReviewAuth } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

//reviews

//Post  review route
router.post('/',isloggedin ,validateReview ,wrapAsync(reviewController.createReview ));

//Delete review route
//pull  operator which removves from the existing array all instance of a value
//that matchees a specific condition
router.delete('/:reviewId',isloggedin,isReviewAuth ,wrapAsync(reviewController.destroyReview));

module.exports = router