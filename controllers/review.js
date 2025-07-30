const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.create = async(req ,res)=>{
  
  let data = await Listing.findById(req.params.id);

  let  newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  data.review.push(newReview);

   await newReview.save();
   await data.save();
   req.flash("success" ," Review created successfully");
  res.redirect(`/listings/${req.params.id}/detail`);

}

 module.exports.delete =  async(req ,res)=>{
  let {id ,reviewId} =req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id ,{$pull:{review: reviewId}});
  req.flash("success" ," Review deleted successfully");
   res.redirect(`/listings/${id}/detail`);
}