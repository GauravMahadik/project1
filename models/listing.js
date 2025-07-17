const mongoose = require("mongoose");
const Review = require("./review.js")

let Schema = mongoose.Schema;

let listSchema = new Schema({
    title:{
        type:String , 
        required:true
    } , 
    description:String , 
    
    image:{
          
        type:String ,
        default :"https://images.unsplash.com/photo-1749253894957-e95b399aa381?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8" ,
        
    } ,
    price:Number , 
    location:String , 
    country:String ,
    review:[{
        type : Schema.Types.ObjectId,
        ref:"Review",
    }
    ]
    
})

listSchema.post("findOneAndDelete" ,async(listing)=>{
if(listing){
      await Review.deleteMany({_id:{$in:listing.review}})
}
})

let Listing = mongoose.model("Listing" , listSchema);

module.exports  = Listing;






















/*   <!-- 
    EJS-Mate Layout Instructions:
    1. Set ejs-mate as the view engine.
    2. Use this file as layout by writing: <% layout("layouts/boilerplate") %> in your EJS files.
    3. <%- body %> is where your page-specific content will be inserted.
    4.use layout("/layouts/boilerplate");
  --> */