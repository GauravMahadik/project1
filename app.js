const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
 app.use(express.static(path.join(__dirname , "public")));
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended:true}));
const {listingSchema , reviewSchema}= require("./joiSchema.js");
app.use(express.json());
const Review = require("./models/review.js");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const passport  = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


if(process.env.NODE_ENV !="production"){
   require('dotenv').config()

}


let dbUrl = process.env.ATLAS_URL;

// const cors = require('cors');
// app.use(cors());


const expressError = require("./utils/expressError");
const asyncWrap = require("./utils/asyncWrap.js");


const listingRoute = require("./routes/listing.js"); //router
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");


 const  engine = require('ejs-mate');
 app.engine('ejs', engine);



app.set("views" , path.join(__dirname , "views"));
main().then((res)=>{
    console.log("connection suucessful");
}).catch(err => console.log(err));



async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const store = MongoStore.create({
  mongoUrl : dbUrl ,
  crypto:{
    secret :process.env.SECRET ,

  },
  touchAfter  : 24*3600 , 
})
const sessionOption = { 
  store ,
  secret:process.env.SECRET,
    resave:false ,
    saveUninitialized:true ,
    cookie:{
       expires:Date.now() + 7 *24*60*60*1000,
       maxAge :7 *24*60*60*1000,
       httpOnly : true,
    }
};

 app.use(session(sessionOption));
 app.use(flash());

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 

app.listen(8080 , ()=>{
    console.log("listening");
})


  app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
     
    next();
  })

  // app.get("/getRegsitered" ,async(req,res)=>{
  //   let fakeUser = new User({
  //     email:"gopal@gmail.com",
  //     username:"Gopal",
  //   })
  //   const registeredUser = await User.register(fakeUser ,"hellogopal");
  //   res.send(registeredUser);
  // });

  

 
app.use("/listings" , listingRoute);

app.use("/listings/:id/review" ,reviewRoute);

app.use("/" ,userRoute);


// app.all(/.*/, (req, res, next) => {
//  next(new expressError(404 ,"page not found!!"));

// });


app.use((err, req, res, next) => {
  let {status=500 ,message="something went wrong!!"}=err;
  res.status(status).render("error.ejs" ,{message});
});
//error handling middleware
