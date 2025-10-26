import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    Author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
   
    },
    content:{
    type:String,
   
    },
    imageUrl:String,
    createdAt:{
    type:Date,
    default:Date.now,
    },
})

const Post = mongoose.model("Post", postSchema);
export default Post;