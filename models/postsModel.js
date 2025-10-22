import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    Author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    },
    content:{
    type:String,
    required:true,
    },
    imageUrl:String,
    createdAt:{
    type:Date,
    default:Date.now,
    },
})

const Post = mongoose.model("Post", postSchema);
export default Post;