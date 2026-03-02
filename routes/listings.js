const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');//error handline utilites
const ExpressErr = require('../utils/ExpressErr.js');
const {listingSchema , reviewSchema} = require('../Schema.js');//listings
const Listing = require('../models/listing');
// const {listingSchema} = require('../Schema');
const {isloggedin, isOwner, validateListing, isReviewAuth} = require('../middleware.js')
const listingController = require('../controllers/listings.js')
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });//initialiser
const {storage} = require('../cloudConfig.js')

const uploads = multer({storage})

//router.route compact way
router.route('/')//index route
.get(wrapAsync(listingController.index))
.post(isloggedin,                //create route
   uploads.single('listing[image]'),
    validateListing,
  wrapAsync (listingController.createListing));//handle err without stopping server.

 
//new route
router.get('/new',isloggedin ,listingController.renderNewForm);

router.route('/:id')
.get( wrapAsync( listingController.showListing))//show route
.put(isloggedin, isOwner ,uploads.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))//edit route
.delete(isloggedin , isOwner, wrapAsync(listingController.destroyListing))//delete route





//edit route
router.get('/:id/edit',isloggedin,  isOwner ,wrapAsync(listingController.renderEditForm ));


module.exports = router