 const Listing = require("../models/listing.js");
 const {listingSchema ,reviewSchema}= require("../joiSchema.js");
const expressError = require("../utils/expressError");
const Review = require("../models/review.js");
 
 
 
 module.exports.isLogedIn = (req ,res, next)=>{
    if(!req.isAuthenticated()){
    //   console.log(req.originalUrl);
      req.session.redirectUrl = req.originalUrl ;
        req.flash("error" , "Please logged in!!");
      return  res.redirect("/login");
    }
    next()
} 

module.exports.redirectUrl = (req, res ,next)=>{
  
  if(req.session.redirectUrl){
    res.locals.redirect = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req, res ,next)=>{
 let {id} =req.params;
 let listing = await Listing.findById(id);

 if(res.locals.currUser && res.locals.currUser._id.equals(listing.owner)){
  next();
 }else{
    req.flash("error" ,"This Listing is not Owned by you!");
  return res.redirect(`/listings/${id}/detail`);
 }
 

}


 module.exports.validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        next(new expressError(400, msg));
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async(req, res ,next)=>{

 let {id ,reviewId} =req.params;
 let review = await Review.findById(reviewId);

 if(review.author.equals(res.locals.currUser._id)){
  next();
 }else{
    req.flash("error" ,"This Review is not Owned by you!");
  return res.redirect(`/listings/${id}/detail`);
 }
 

}