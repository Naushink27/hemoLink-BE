import mongoose from "mongoose";

const interestSchema=new mongoose.Schema({
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    request:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DonationRequest",
        required:true,
    },
    donorName:String,
    email:String,
    phone:String,
    bloodGroup:String,
    address:String,
    desciption:String,
    createdAt:{
        type:Date,
        default:Date.now,
    },

    
})

const Interest=mongoose.model("Interest",interestSchema);
export default Interest;