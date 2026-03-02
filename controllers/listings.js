const { model } = require('mongoose');
const Listing = require('../models/listing');
const axios = require("axios");
const User = require("../models/user");

//all listings and Search bar
module.exports.index = async (req, res) => {

  let { search } = req.query;

  let allListings;
  let allUsers;

  if (search) {
    allListings = await Listing.find({
      $or: [
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } }
      ]
    });
  } else {
    allListings = await Listing.find({});
    // allUsers = await User.find({});
  }

  res.render("listings/index", { allListings });
};


module.exports.renderNewForm = (req,res)=>{//authentication
   console.log(req.user);
   // if(!req.isAuthenticated){
   //    req.flash("success", "you must be logged in to create listings!");
   //    res.redirect('/login');
   // }
   //middleware
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req,res)=>{
  let {id} = req.params;
  const listings = await Listing.findById(id).populate({path : 'reviews',
    model : 'Review', populate : { path : "author"}}).populate('owner');//by fieldname
    console.log(listings);
 if(!listings){
    req.flash('error', "listing you requested does not existed!");
    res.redirect('/listings');
 }
 console.log(listings);
  res.render('listings/show.ejs',{listings});
}

// module.exports.createListing = async (req,res)=>{//check path
//     // let {title, description, image, price,country, location} = req.body;
//     //Or make key value pair
//     // let listing = req.body.listing;//!check
//     // let result = ListingSchema.validate(req.body);
//     // console.log(result);//Joi validation
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     //validations
//     newListing.owner = req.user._id;
//     newListing.image = {url,filename}
//     await newListing.save();
//     req.flash('success', "New Listing created!");
//     res.redirect('/listings');
    
// }

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;

  //  Only set image if file exists
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
 console.log(req.file)
  await newListing.save();
  req.flash('success', "New Listing Created!");
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
    // req.flash('success', "Listing edited!");
    if(!listing){
    req.flash('error', "Listing you requested does not existed!");
    res.redirect('/listings')
 }
   res.render('listings/edit',{listing});
}

// module.exports.updateListing = async (req,res)=>{
//   let {id} = req.params;//extract id
//   //auth
// //   let listing = await Listing.findById(id)//auth
// //   if(!listing.owner._id.equals(res.locals.currUser._id)){
// //    req.flash("error", "You dont have permission to edit!");
// //    return res.redirect(`listings/${id}`);
// //   }
//   const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});//deconstructing
//   if(typeof req.file != 'undefined'){
//   let url = req.file.path;
//   let filename = req.file.filename;
//   listing.image = {url,filename};
//   await listing.save();
//   req.flash('success', " Listing updated!");
//   res.redirect('/listings');
//   }
 
// }


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash('success', "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', " Listing deleted!");
    res.redirect('/listings');
}