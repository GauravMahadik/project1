const mongoose = require("mongoose");

let Schema = mongoose.Schema;


const reviewSchema = new Schema({
   
    rating:{
        type:Number,
        min:1,
        max:5,
    },
     content:String,
    createdAt:{
        type:Date,
        default:Date.now(),
    },
})

module.exports = mongoose.model("Review" ,reviewSchema);