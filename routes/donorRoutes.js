import express from 'express';
import { verifyToken,isDonor } from './authMiddleware.js';
import User from '../models/userModel.js';
import Post from '../models/postsModel.js';


const router= express.Router();

// Get donor profile

router.get('/profile',verifyToken,isDonor,async(req,res)=>{
    try{

        const donor=await User.findById(req.user.id).select('-password');
        if(!donor){
            return res.status(404).json({message:"Donor not found"})
        }
        res.status(200).json(donor);

    }catch(errr){
        res.status(500).json({message:error.message})
    }
})

router.patch('/update',verifyToken,isDonor,async(req,res)=>{
    try{
        const {fullName,phone,state,city}=req.body;

        const updatedDonor=await User.findByIdAndUpdate(
            req.user.id,
            {fullName,phone,state,city},
            {new:true,runValidators:true}
        ).select('-password');
        if(!updatedDonor){
            return res.status(404).json({message:"Donor not found"})
        }
        // await updatedDonor.save();
        res.status(200).json({message:"Profile updated successfully",updatedDonor});
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})


// API for creating posts:

router.post('/posts', verifyToken, isDonor, async (req, res) => {
  try {
      
    const { content, imageUrl } = req.body;

    if (!content || !imageUrl) {
      return res.status(400).json({ message: "Please provide content or image" });
    }

    const newPost = new Post({
      Author: req.user.id,
      content,
      imageUrl,
    });

    await newPost.save();
    await newPost.populate("Author", "fullName email"); // optional
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/allposts', verifyToken, isDonor, async (req, res) => {

    try {
        const posts = await Post.find().populate("Author","fullName email")
        res.status(200).json(posts);
            
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;
