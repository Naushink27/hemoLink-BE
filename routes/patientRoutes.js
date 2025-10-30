import express from "express";
import { isPatient, verifyToken } from "./authMiddleware";

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

export default router;