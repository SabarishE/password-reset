import express from "express";

import {User} from "../models/userModel.js";

import jwt from "jsonwebtoken";

import { transporter } from "./authModel.js";

const secretKey="mysecretkey";

import bcrypt from "bcryptjs"
// import bcrypt from "bcrypt";

const router =express.Router();

// getting all users from mongoDB

router.get("/",async(req,res)=>{

    const users = await User.find();
    console.log(users,"number of users-->>>-- "+users.length);
    
    res.send(users);
    
})

// ------------ sign up--------------

router.post("/signup",(async(req,res)=>{

  const adduser=req.body ;
  console.log("Sign up input details >>>>",adduser);

  const salt=await bcrypt.genSalt(10);

  const passwordHash =await bcrypt.hash(adduser.password,salt);

   console.log("After new SIGNUP >>>","\n",adduser)
  

   const user=new User({
     name:adduser.name,
     email:adduser.email,

     passwordHash
   })

  try{
    const newuser =await user.save();
    res.send({newuser:newuser,message:"---------registration success !!!---------"});
    console.log("registration success !!!",newuser);
  }
  catch(err){
     res.status(500);
     res.send(err);
     res.send({message:"input -- error"});
  }

}));



router.post("/login",async(req,res)=>{

  // getting login details -Input from frontend
   const Input =req.body;
   console.log("Login alert >>>",Input);
 
 try{
 
   const userLoggingIn= await User.find({email:Input.email});

 
   const isMatch=await bcrypt.compare(Input.password,userLoggingIn[0].passwordHash);
   if(!isMatch)
   {
     res.status(500);
     res.send({message:"---- invalid credentials in POST----"});
     console.log("---- invalid credentials in POST----");
   }
   else
   {
     res.send({message:"---- successful login in POST (Authentication success)----"});
     console.log("---- successful login in POST ----");
   }
 
 }
 
 catch(err)
 {
   res.status(500);
   res.send(err);
   console.log("Error  !!!");
 }
 
 })


//-----forgot password form------

router.get("/forgotpwd",async(req,res)=>{

  // onclick of forgot password button url is redirected to forgot password form
  res.send("forgot password ????");

});

// ------sending one time link to user's mail to change password

router.post("/forgotpwd",async(req,res)=>{


  try{
  const pwdrequester= await User.find({email:req.body.email});
 


       // JWT secret key in combined with unique old password of user.
    const supersecretKey=secretKey + pwdrequester[0].passwordHash;

    const payload={name:pwdrequester[0].name}
    //signing JWT token

    const token =jwt.sign(payload,supersecretKey);

      User.findOneAndUpdate({name:pwdrequester[0].name},{randomString:supersecretKey},{new: true,useFindAndModify: false})
      .then((x)=>console.log("user details with string update>>>>>",x))
      .catch((err)=>console.log(err.message))
    
    


   

    const link=`http://localhost:5000/users/resetpwd/${pwdrequester[0].name}/${token}`;

    console.log("one time link >>>>",link);

//-----sending one time link through mail usig "nodemailer"


//     var mailOptions = {
//       from: 'lykanh007@gmail.com',
//       to: 'lykanh007@gmail.com',
//       subject: 'reset password mail',
//       text: link
//     };

//     transporter.sendMail(mailOptions, function(error, info){
// if (error) {
//   console.log(error);
// } else {
//   console.log('Email sent: ' + info.response);
// }
// });


    res.send(["one time link >>>>",link]);
  }
catch(err) {
    res.status(500);
    res.send(err.message);
    console.log("Error  !!!");

  }

});



router.get("/resetpwd/:name/:token",async(req,res)=>{

const {name,token}=req.params;
// res.send(req.params);

 try{
  const pwdrequester= await User.find({name:name});

   

//----- Verification of received JWT token ------

  

  const isMatch=jwt.verify(token,pwdrequester[0].randomString);

  if(isMatch)
  {
    console.log("---token matched in reset request------")
    res.send({email:pwdrequester[0].email});
  }

 }
 catch(err){
   res.send(err.message);
   console.log("------token not matched in reset request -----")
 }

 });


//---------- new password post and update -----------

 router.post("/resetpwd/:name/:token",async(req,res)=>{


  const {name,token}=req.params;
  const {pwd,confirmpwd}=req.body

  try{
    const pwdrequester= await User.find({name:name});
  
  
  //----- Verification of received JWT token ------
  
 
  
    const isMatch=jwt.verify(token,pwdrequester[0].randomString);


  
    if(isMatch&&(pwd==confirmpwd))
{

  const salt=await bcrypt.genSalt(10);

  const passwordHash =await bcrypt.hash(pwd,salt);

      User.findOneAndUpdate({name:pwdrequester[0].name},{passwordHash:passwordHash,randomString:""},{new: true,useFindAndModify: false})
    
    .then((m) => {
        if (!m) {
            return res.status(404).send("error in match");
        }
        else{
            res.send(m);
            console.log("password changed",m)
        }
        
    }).catch((error) => {
        res.status(500).send(error);
        console.log("error in pwd change",error)
    })
    }
  
   }
   catch(err){
     res.send(err.message);
     console.log("token not matched in reset post >>>>>")
   }



 });



export default router;