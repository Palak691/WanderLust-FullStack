const Listing = require('../models/listing');
const Reviews = require('../models/reviews');

module.exports.createReview = async(req,res)=>{
   let listings = await Listing.findById(req.params.id);
   let newReview  = new Reviews(req.body.review);
   newReview.author = req.user._id;

   console.log(newReview);

   listings.reviews.push(newReview);
   await newReview.save();
   await listings.save();
   req.flash('success', "New Review Created!");
   console.log("New review saved");
   res.redirect(`/listings/${listings._id}`);

//    res.send("new review saved!")
}

module.exports.destroyReview = async (req,res)=>{
       let {id, reviewId} = req.params;
       await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});//pull out that matcched review id inside listings
       await Reviews.findByIdAndDelete(reviewId);
       res.redirect(`/listings/${id}`);
}