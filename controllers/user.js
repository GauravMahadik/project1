const User = require("../models/user");
    
    
//signup form
    module.exports.signupForm = (req,res)=>{
        res.render("Users/signup.ejs");
    
    
    }
    //user sign up 
    module.exports.signup =  async(req,res)=>{
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
    
    }


//user login form
   module.exports.loginForm =  (req,res)=>{
  res.render("Users/login.ejs");
}
     

//new user login
  module.exports.login = async(req,res)=>{
    
    req.flash("success" ,"Welcome to back Wanderlust");
    // console.log(redirect);
     let urlRedirect = res.locals.redirect || "/listings";
    res.redirect(urlRedirect);
}

//user logout
  module.exports.logOut = (req ,res, next)=>{
req.logOut((err)=>{
req.flash("success" , "you logged out!");
res.redirect("/listings");
});


}