const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap =require("../utils/asyncWrap");
const passport = require("passport");
const { redirectUrl } = require("../views/middleware");

router.get("/signUp" , (req,res)=>{
    res.render("Users/signup.ejs");


})

router.post("/signUp" ,asyncWrap(async(req,res)=>{
  try{
      let {username ,email, password} =req.body;
    const newUser = new User({username ,email});
    
   const registerUser = await  User.register(newUser ,password);
  req.login(registerUser , (err)=>{
    if(err){
      next(err);
    }
        req.flash("success" ,"Welcome to Wanderlust");
    res.redirect("/listings");
  })

  }catch(e){
    req.flash("error" ,e.message);
    res.redirect("/signUp");
   }

}));

router.get("/login" , (req,res)=>{
  res.render("Users/login.ejs");
})

router.post('/login', redirectUrl , passport.authenticate('local', {

  failureRedirect: '/login',
  failureFlash: true ,

}) , async(req,res)=>{
    
    req.flash("success" ,"Welcome to back Wanderlust");
    // console.log(redirect);
     let urlRedirect = res.locals.redirect || "/listings";
    res.redirect(urlRedirect);
}
);

router.get("/logout" ,(req ,res, next)=>{
req.logOut((err)=>{
req.flash("success" , "you logged out!");
res.redirect("/listings");
});


})


module.exports = router;