const Listing = require('./models/listing');
const ExpressErr = require('./utils/ExpressErr');
const {listingSchema , reviewSchema} = require('./Schema');//listings
const Reviews = require('./models/reviews');



// module.exports.isloggedin = (req,res, next)=>{
//     // console.log(req.user);
//     console.log(req.path, ",", req.originalUrl);//we want to user to stay on clicked page 
//     //after login

//      if(!req.isAuthenticated()){
//       res.session.redirectUrl = req.originalUrl;//
//       req.flash("success", "you must be logged in to create listings!");
//       res.redirect('/login');
//    }
//    next()
// }
module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;  // ✅ correct
    //  req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// module.exports.saveRedirectUrl = (req,res,next)=>{
//     if(req.session.redirectUrl){
//       res.locals.redirectUrl = req.session.redirectUrl;//

//     }
//     next();
// }
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl; 
      delete req.session.redirectUrl; // optional but recommended
    }
    next();
}

//authorization
module.exports.isOwner = async (req,res, next)=>{
  let {id} = req.params;
   let listing = await Listing.findById(id)//auth
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You dont have permission to edit!");
   return res.redirect(`/listings/${id}`);
  }
  next();
}

//validation listings
module.exports.validateListing = (req, res, next)=>{//middleware
 let {error} = listingSchema.validate(req.body);
 if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressErr(400, errMsg);

 }else{
    next();
 }
}
//validate review
module.exports.validateReview = (req, res, next)=>{//middleware
 let {error} = reviewSchema.validate(req.body);
 if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressErr(400, errMsg);

 }else{
    next();
 }
}
//review
module.exports.isReviewAuth = async (req,res, next)=>{
  let {id,reviewId} = req.params;
   let review = await Reviews.findById(reviewId);//auth
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the author of the review!");
   return res.redirect(`/listings/${id}`);
  };
  next();
}