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

 