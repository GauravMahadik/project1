 module.exports.isLogedIn = (req ,res, next)=>{
    if(!req.isAuthenticated()){
    //   console.log(req.originalUrl);
      req.session.redirectUrl = req.originalUrl ;
        req.flash("error" , "Please logged in!!");
      return  res.redirect("/login");
    }
    next()
} 

module.exports.redirectUrl = (req, res ,next)=>{
  
  if(req.session.redirectUrl){
    res.locals.redirect = req.session.redirectUrl;
  }
  next();
}
