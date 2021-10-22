//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption");
const ejs = require('ejs');
const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(encrypt, {secret:process.env.secret, encryptedFields: ['password'] });
const User=new mongoose.model("User",userSchema);
app.get("/",(req,res)=>
{
    res.render("home");    
} 
)
app.post("/register",(req,res)=>
{
    const newUser=new User(
        {
            email:req.body.username,
            password:req.body.password
        }
    )
    newUser.save().then((result) => {
        res.render("secrets");
    }).catch((err) => {
        console.log(err);
    });
}
);
app.post("/login",(req,res)=>
{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username}).then
    (foundUser=>{
        if(foundUser.password==password)
        {
            res.render("secrets");
        }
        else
        {
            console.log("password incorrect");
        }
    }).catch(err=>{
        console.log(err);
    });
}
)
app.get("/login",(req,res)=>
{
    res.render("login");    
}
)
app.get("/register",(req,res)=>
{
    res.render("register");    
}
)
app.get("/logout",(req,res)=>
{
    res.render("home");
}
)

app.listen(3000);