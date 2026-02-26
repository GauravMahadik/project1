const Listing = require("../models/listing");

// Show all listings
 module.exports.showListing =async (req, res) => {
    const lists = await Listing.find({});
    res.render("listings/index.ejs", { lists });
}
// Show form to add new listing
module.exports.newListing = (req, res) => {
    res.render("listings/edit.ejs");
}
// Add new listing
module.exports.addListing= async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url ,filename);

let additem = new Listing(req.body.listing);
additem.image = {url, filename};
  console.log(req.user);
   additem.owner = req.user;
  await additem.save();
  req.flash("success" ,"listing added successfully");
  res.redirect("/listings");
   
 
}
// Show details
module.exports.detail = async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findById(id).populate({path:"review" , populate:{path:"author"}}).populate("owner");
    if(!item){
      req.flash("error" ,"listing does not exists");
     return  res.redirect("/listings");
   
    }
      res.render("listings/detail.ejs", { item });
}

// Show form to edit listing
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const item = await Listing.findById(id);
   if(!item){
      req.flash("error" ,"listing does not exists");
      return res.redirect("/listings");
     
    }
    
    res.render("listings/new.ejs", { item });
}
// Edit listing
module.exports.editListing =  async (req, res) => {
  let { id } = req.params;
 

  let edititem = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true
  });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    edititem.image = {url ,filename};
    await edititem.save();
  }
  req.flash("success" ," Listing edited successfully");

  res.redirect(`/listings/${id}/detail`);
}
   // Delete listing
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" ," Listing deleted successfully");
    res.redirect("/listings");
}

 module.exports.search = async(req ,res) =>{
  const {search} = req.body;
 
   let lists =  await Listing.find({location:`${search}`});
   
   if(lists.length>0){
   res.render("listings/search.ejs", { lists });
   }else{
     req.flash("error"," Listing with this location is not added");
       res.redirect("/listings");
   }
 }

 module.exports.trendings = async(req ,res)=>{
      const lists = await Listing.find({ price: { $gt: 3000 } });

    if (lists.length > 0) {
      res.render("listings/trendings.ejs", { lists });
    } else {
      req.flash("error", "No trending listings available right now");
      res.redirect("/listings");
    }

 }
  module.exports.private =async (req, res) => {
    const lists = await Listing.find({});
    res.render("listings/private.ejs", { lists });
}
module.exports.topofworld  = async(req ,res)=>{
  const highAltitudePlaces = [
      // India
      "Ladakh", "Leh", "Spiti Valley", "Manali", "Shimla",
      // Nepal
      "Kathmandu", "Pokhara", "Everest Base Camp",
      // Tibet / China
      "Lhasa", "Tibet", "Mount Kailash",
      // South America
      "Cusco", "Machu Picchu", "La Paz", "Quito",
      // North America
      "Aspen", "Denver", "Telluride", "Banff",
      // Europe
      "Zermatt", "Chamonix", "St. Moritz", "Interlaken",
      // Africa
      "Mount Kilimanjaro", "Addis Ababa"
    ];

    const lists = await Listing.find({
      location: { $in: highAltitudePlaces }
    });

    if (lists.length > 0) {
      res.render("listings/topOfWorld.ejs", { lists });
    } else {
      req.flash("error", "No Top of the World listings available right now");
      res.redirect("/listings");
    }
}

module.exports.amazingView = async (req, res) => {
  
    const scenicPlaces = [
      // Beaches & Islands
      "Maldives", "Bali", "Goa", "Phuket", "Santorini",
      "Maui", "Hawaii", "Bora Bora", "Seychelles", "Fiji",

      // Mountains & Valleys
      "Swiss Alps", "Zermatt", "Interlaken", "Chamonix", "Banff",
      "Aspen", "Manali", "Shimla", "Leh", "Ladakh", "Spiti Valley",

      // Lakes
      "Lake Como", "Lake Tahoe", "Lake Louise", "Pokhara",
      "Dal Lake", "Plitvice Lakes",

      // Cities
      "Dubai", "New York", "Hong Kong", "Singapore", "Paris", "Istanbul"
    ];

    const lists = await Listing.find({
      location: { $in: scenicPlaces }
    });

    if (lists.length > 0) {
      res.render("listings/amazingView.ejs", { lists });
    } else {
      req.flash("error", "No Amazing View listings available right now");
      res.redirect("/listings");
    }
  }

  module.exports.newListings = async (req, res) => {
 
    // Fetch last 10 newly created listings
    const lists = await Listing.find().sort({ createdAt: -1 }).limit(10);

    if (lists.length > 0) {
      res.render("listings/freshnew.ejs", { lists });
    } else {
      req.flash("error", "No new listings available right now");
      res.redirect("/listings");
    }
  }
