import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected successfully");
    }
    catch(err){
        console.error("Database connection failed",err);
    }
}

export default connectDB;