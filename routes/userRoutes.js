import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const router= express.Router();


/* ==================Registeration =================== */


router.post('/register',async(req,res)=>{
try{
    const {fullName,email,password,bloodGroup,location,phone,role}=req.body
    if(!fullName || !email || !password || !bloodGroup || !phone || !location||!role){
        return res.status(400).json({message:"Please fill all required fields"})
    }

    // check if user already exists

    const userExists=await User.findOne({email})
    if(userExists){
        return res.status(400).json({message:"User already exists"})
    }

    //Hash Password

    const hashedPassword=await bcrypt.hash(password,10);


    //Create new User

    const newUser= new User({
        fullName,
        email,
        password:hashedPassword,
        bloodGroup,
        role,
        location,
        phone

    })
    await newUser.save();
    res.status(201).json({message:"User registered successfully"},newUser)

}
catch(error){
    res.status(500).json({message:error.message})
}



})


/* ==================Login =================== */


router.post('/login',async(req,res)=>{
    try{

        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please fill all required fields"})
        }

        //check if user exists

        const user= await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        console.log(user)

        //compare password

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        //Generate Token 
        if (!process.env.JWT_SECRET) {
  return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not set' });
}

        const token= jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

          if(!token){
            return res.status(500).json({message:"Could not generate token"})
          }
        res.cookie("token",token)

        res.status(200).json({message:"Login Successful",user})
    }catch(error){
    res.status(500).json({message:"Server Error",error: error.message})
    }
})

export default router;