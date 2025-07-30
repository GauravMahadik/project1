const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const {listingSchema , reviewSchema}= require("../joiSchema.js");
const expressError = require("../utils/expressError");
const asyncWrap = require("../utils/asyncWrap.js");
const {isLogedIn , isOwner ,validateSchema} = require("../views/middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}) //for image accessing

const listing = require("../controllers/listing.js");







// Show all listings
router.get("/", asyncWrap(listing.showListing));

// Show form to add new listing
router.get("/new",isLogedIn, listing.newListing );

// Add new listing
//  router.post("/new", listing.addListing);

//

// Show details

router.post("/new" , isLogedIn , upload.single('listing[image]') ,  validateSchema, asyncWrap(listing.addListing 
    
));
router.get("/:id/detail", asyncWrap(listing.detail));

// Show form to edit listing
router.get("/:id/edit",isLogedIn, isOwner , asyncWrap(listing.editForm));

// Edit listing
router.put("/:id/edit", isLogedIn , isOwner, upload.single('listing[image]'), validateSchema, asyncWrap(listing.editListing));

// Delete listing
router.get("/:id/delete", isLogedIn, isOwner , asyncWrap(listing.delete));




module.exports = router;