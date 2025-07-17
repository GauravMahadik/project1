const express = require("express");
const app = express();
const path = require("path");
 app.use(express.static(path.join(__dirname , "public")));
app.set("view engine" , "ejs");


const session = require('express-session');
const flash = require('connect-flash');



const sessionOption = { secret:"mysecretcode",
    resave:false ,
    saveUninitialized:true 
};
app.use(session(sessionOption));

app.use(flash());

//middleware for values
app.use((req , res ,next)=>{
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    next();
})

app.get("/register" ,(req ,res)=>{
    let {name ="ananomous"} = req.query;
    
   req.session.name = name;
   if(name==="ananomous"){
    req.flash("error" ,"user not registered succesfully");
   }else{
   req.flash("success" ,"user registered succesfully");
   }
  res.redirect("/hello");
})

app.get("/hello" ,(req, res)=>{

    //so we can place values in middleware as well here in route
   res.render("flash.ejs" ,{name:req.session.name });
})











// app.get("/counts", (req,res)=>{
//     if(req.session.count){
//         req.session.count++ ;
//     }else{
//         req.session.count =1;
//     }
//     res.send(`hii the value of count is${req.session.count}`);
// })









// app.get("/sessions" ,(req,res)=>{
//     res.send("hi sesssion");
// })
























// const cookieParser = require('cookie-parser')

// app.use(cookieParser("secretcode"));
// app.get("/" ,(req ,res)=>{
//     res.send("hi there");
// })

// app.get("/getsignedcookies" , (req, res)=>{
// res.cookie("made-in" ,"India" ,{signed:true});
// res.cookie("greet" ,"Hello");
// res.send("signed cookie send");
// })

// //so these are signed cookies no one tamper them if tamper cookies will not return tampered value.

// app.get("/verifies" ,(req,res)=>{
//     console.log(req.signedCookies);
//     // console.log(req.cookies);
//     res.send("verified");
// })



// app.get("/cookies" , (req,res)=>{
//     res.cookie("greet" ,"namasate");
//     res.cookie("name" ,"Gaurav");
//     res.send("cookie is been send");
// })
// app.get("/greets" ,(req ,res)=>{
    
//     let{name} = req.cookies;
//     res.send(`hi name is ${name}`);
    

app.listen("3000" , (req,res)=>{
    console.log("cookies is listening");
})



//so to parse cookies we use cookie-parser package and required it and use  it
//and while accessing cookie we use access it through req.cookies.