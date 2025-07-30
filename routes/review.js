const express = require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const { reviewSchema}= require("../joiSchema.js");

const Review = require("../models/review.js");
const expressError = require("../utils/expressError");
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing.js");
const {isLogedIn ,isReviewAuthor} = require("../views/middleware.js");
const review = require("../controllers/review.js");



 const validateReview = (req,res,next)=>{
   let {error} = reviewSchema.validate(req.body);
   
   if(error){
    const msg = error.details.map(el => el.message).join(",");
   next(new expressError(404,msg));
   }
   else{
    next();
   }
}



//review creation
router.post("/" , isLogedIn, validateReview, asyncWrap(review.create))


//review deletion
router.delete("/:reviewId" ,isReviewAuthor , asyncWrap(review.delete))


module.exports = router;