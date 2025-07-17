const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const { reviewSchema}= require("../joiSchema.js");

const Review = require("../models/review.js");
const expressError = require("../utils/expressError");
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing.js");




const validateReview = (req,res,next)=>{
let {error} = reviewSchema.validate(req.body);
   
   if(error){
   next(new  expressError(404 ,"something went wrong"));
   }
   else{
    next();
   }
}

//review creation
router.post("/" ,  validateReview , asyncWrap(async(req ,res)=>{
  
  let data = await Listing.findById(req.params.id);

  let  newReview = new Review(req.body.review);
  data.review.push(newReview);

   await newReview.save();
   await data.save();
   req.flash("success" ," Review created successfully");
  res.redirect(`/listings/${req.params.id}/detail`);

}))


//review deletion
router.delete("/:reviewId" , asyncWrap(async(req ,res)=>{
  let {id ,reviewId} =req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id ,{$pull:{review: reviewId}});
  req.flash("success" ," Review deleted successfully");
   res.redirect(`/listings/${id}/detail`);
}))


module.exports = router;