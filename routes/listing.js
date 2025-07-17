const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const {listingSchema , reviewSchema}= require("../joiSchema.js");
const expressError = require("../utils/expressError");
const asyncWrap = require("../utils/asyncWrap.js");
const {isLogedIn} = require("../views/middleware.js");


const validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        next(new expressError(400, msg));
    } else {
        next();
    }
}




// Show all listings
router.get("/", asyncWrap(async (req, res) => {
    const lists = await Listing.find({});
    res.render("listings/index.ejs", { lists });
}));

// Show form to add new listing
router.get("/new",isLogedIn, (req, res) => {
    res.render("listings/edit.ejs");
});

// Add new listing
router.post("/new",isLogedIn, validateSchema, asyncWrap(async (req, res) => {
  if (req.body.listing.image === '') {
    delete req.body.listing.image;
  }

  let additem = new Listing(req.body.listing);
  await additem.save();
  req.flash("success" ," Listing added successfully");
  res.redirect("/listings");
}));

// Show details
router.get("/:id/detail", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findById(id).populate("review");
    if(!item){
      req.flash("error" ,"listing does not exists");
     return  res.redirect("/listings");
   
    }
      res.render("listings/detail.ejs", { item });
}));

// Show form to edit listing
router.get("/:id/edit",isLogedIn, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findById(id);
   if(!item){
      req.flash("error" ,"listing does not exists");
      return res.redirect("/listings");
     
    }
    res.render("listings/new.ejs", { item });
}));

// Edit listing
router.put("/:id/edit", isLogedIn ,validateSchema, asyncWrap(async (req, res) => {
  let { id } = req.params;
  if (req.body.listing.image === '') {
    delete req.body.listing.image;
  }

  let edititem = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true
  });
  req.flash("success" ," Listing edited successfully");

  res.redirect(`/listings/${id}/detail`);
}));

// Delete listing
router.get("/:id/delete", isLogedIn, asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" ," Listing edited successfully");
    res.redirect("/listings");
}));




module.exports = router;