import e from "cors";
import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema({
 
    requester:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    },
    bloodGroupNeeded:{
    type:String,
    enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"],
    required:true,
    },
    hospitalName:String,
    city:String,
    state:String,
    unitRequired:Number,
    urgency:{
    type:String,
    enum:["low","medium","high"],
    default:"medium",
    },
    status:{
    type:String,
    enum:["pending","approved","rejected","completed"],
    default:"pending",
    },
    createdAt:{
    type:Date,
    default:Date.now,
    },

})

const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);
export default DonationRequest;