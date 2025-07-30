const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap =require("../utils/asyncWrap");
const passport = require("passport");
const { redirectUrl } = require("../views/middleware");
const user = require("../controllers/user");
 
//signup form
router.get("/signUp" , user.signupForm);

  //user sign up 
router.post("/signUp" ,asyncWrap(user.signup));

//user login form
router.get("/login" , user.loginForm)


//new user login
router.post('/login', redirectUrl , passport.authenticate('local', {

  failureRedirect: '/login',
  failureFlash: true ,

}) , user.login);

//user logout
router.get("/logout" ,user.logOut);


module.exports = router;