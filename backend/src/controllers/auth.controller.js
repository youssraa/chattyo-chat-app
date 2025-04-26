import bycrypt, { hash } from "bcryptjs"
import User from "../models/user.model.js"
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=>{
const {fullName,email,password }=req.body
try{
    // hash password 
    if(password <6 ){ res.status(400).json({
        message :" Past word must be at least 6 characters "
    })
    }
    if(!password || !fullName || !email ){ res.status(400).json({
        message :" you must fil all the required fields "
    })
    }
    const user = await User.findOne({email})
    if(user) {
        return res.status(400).json({message :" user already exist !!"})
    }
    const salt = await bycrypt.genSalt(10) 
    const hashedPassword = await bycrypt.hash(password,salt)
    const newUser = new User({
        fullName   ,
        email ,
        password : hashedPassword
    })

    if(newUser){
        // generatetoken here
       
        generateToken(newUser._id , res)
       
        await newUser.save(),
        res.status(201).json({
            _id : newUser._id ,
            fullName : newUser.fullName ,
            email : newUser.email ,
            profilePic : newUser.profilePic
        })
    } else {
        res.status(400).json({message :" invalid user data "})
    }


}
catch(error){
console.log("Error in signup controller", error.message)
}
}



export const login = async (req,res)=>{
   const {email,password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user) {
           return res.status(400).json({message : " invalid credentials "}) ;
        }
        if(!email || !password ){
            return res.status(400).json({message : "Please fil all  the required fields"})
        }
        const isPasswordCorrect = await bycrypt.compare(password , user.password)
        if(!isPasswordCorrect){
          return  res.status(400).json({message : "Invalid credentiel"})  
        }
        generateToken(user._id , res)
        res.status(200).json({
            _id :user._id ,
            fullName : user.fullName ,
            email : user.email ,
            profilePic : user.profilePic
            
        })

    
   } catch (error) {
    console.log("Error in login controller", error.message)
    res.status(500).json({message :"Internal Server Error"})
   }
}


export const logout =(req,res)=>{
    try {
        res.cookie("jwt", "" ,{maxAge : 0})
        res.status(200).json({message: " Logout successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({message :"Internal Server Error"})
    }
  
}



export const updateProfile = async (req,res) =>{
try {
    const {profilePic} =req.body ;
    const userId = req.user._id ;
    console.log("show me request" ,req.body)
    if(!profilePic){
      return  res.status(404).json({message : " Profile Picture is required "})
   }
   console.log("Received profilePic:", profilePic);
   const uploadedResponse = await cloudinary.uploader.upload(profilePic);
   console.log("Cloudinary upload response:", uploadedResponse);
   const uploadedUser = await User.findByIdAndUpdate(userId ,{profilePic : uploadedResponse.secure_url} ,{new : true} )
   console.log("user after update" + uploadedUser) 
   res.status(200).json(uploadedUser) 
} 
catch (error) {
    console.log("Error in update  profile image controller", error.message)
    res.status(500).json({message :"Internal Server Error"})   
}
}


export const checkAuth =(req,res)=>{
    try {
        console.log(req.user)
        res.status(200).json(req.user)
    } catch (error) {
    console.log("Error in check auth  controller", error.message)
    res.status(500).json({message :"Internal Server Error"})  
        
    }
}