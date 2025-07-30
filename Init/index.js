const mongoose = require("mongoose");
const initData = require("./data.js");  // Use the correct variable name
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

async function init() {
  await Listing.deleteMany({}).then((res)=>{
    console.log(res);
  });
    initData.data = initData.data.map((obj)=>({
    ...obj ,owner:'68735c10f4a8f41ad3649a37'
   }));
  await Listing.insertMany(initData.data);  // Fix: Use the correct variable, and no need for {init: data}
  console.log("Data inserted successfully");
}

init();
