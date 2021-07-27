import mongoose from "mongoose";

// creating schmema for users collection in userlist DB 

const userschema= new mongoose.Schema({

    
  
 
    name:{type:String,required:true},
    email:{type:String,required:true},
    passwordHash:{type:String},
    randomString:{type:String}

})

export const User = mongoose.model("user",userschema);