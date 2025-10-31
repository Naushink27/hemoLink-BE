import express from "express";
import { isPatient, verifyToken } from "./authMiddleware.js";
import DonationRequest from "../models/donationRequestModel.js";
import User from "../models/userModel.js";
import Post from "../models/postsModel.js";

const router = express.Router();


//Get patient profile


router.get ('/profile',verifyToken,isPatient,async(req,res)=>{
    try{
            const patient=await User.findById(req.user.id).select('-password');
            if(!patient){
                return res.status(404).json({message:"Patient not found"})
            }
            res.status(200).json(patient);
    }catch(err){
        res.status(500).json({message:err.message})   
    }
})

//Update patient profile

router.patch('/update',verifyToken,isPatient,async(req,res)=>{
    try{

        const {fullName,phone,state,city}=req.body;

        const updatedPatient=await User.findByIdAndUpdate(
            req.user.id,
            {fullName,phone,state,city},
            {new:true,runValidators:true}
        ).select('-password');
        if(!updatedPatient){
            return res.status(404).json({message:"Patient not found"})
        }
        res.status(200).json({message:"Profile updated successfully",updatedPatient});
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/request',verifyToken,isPatient,async(req,res)=>{
    try{
        const {bloodGroupNeeded,hospitalName,city,state,unitRequired,urgency}=req.body;

        const newRequest= new DonationRequest({
            requester:req.user.id,
            bloodGroupNeeded,
            hospitalName,
            city,
            state,
            unitRequired,
            urgency
        })

        const savedRequest=await newRequest.save();
        res.status(201).json({message:"Donation request created successfully",savedRequest});

    }catch(err){
        res.status(500).json({message:err.message})
    }
})


router.post('/post',verifyToken,isPatient,async(req,res)=>{
    try{
        const {content,imageUrl}=req.body;
        if(!content || !imageUrl){
            return res.status(400).json({message:"Please provide content or image"})
        }
        const newPost=new Post({
            author:req.user.id,
            content,
            imageUrl,
        })
        await newPost.save();

        res.status(201).json({message:"Post created successfully",newPost});
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.get('/allposts',verifyToken,isPatient,async(req,res)=>{
    try{
        const posts=await Post.find()
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

export default router;