const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
   
    image : {
        url : String,
        filename : String
    },

    price :{
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
  
  geometry: {
  type: {
    type: String,
    enum: ["Point"],  // Must be "Point"
    // required: true
  },
  coordinates: {
    type: [Number],   // [longitude, latitude]
    // required: true
  }
}
});

const listing = mongoose.model("Listing",listingSchema);
//listing post middleware 
// to delete review after deleting listing
listingSchema.post('findOneAndDelete', async (listing)=>{
    if(listing){
     await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});
module.exports = listing