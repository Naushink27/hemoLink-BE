import mongoose from "mongoose";

const userSchema= new mongoose.Schema({

fullName:{
    type:String,
    required:[true,"Full Name is required"],
    minlength:[3,"Full Name must be at least 3 characters long"],


},
email:{
    type:String,
    required:true,
    unique:true,
    match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"],

},
password:{
    type:String,
    required:true,
    minlength:[8,"Password must be at least 6 characters long"],
    match:[/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,"Password must contain at least one letter, one number and one special character"]
},
role:{
    type:String,
    enum:["donor","patient","admin"],
    default:"patient",
},
bloodGroup:{
    type:String,
    enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"],
    required:true,
},

state:{
    type:String,
},
city:{
    type:String,
},
phone:{
    type:String,
    required:true,
    match:[/^\d{10}$/,"Please fill a valid 10 digit phone number"],
},
createdAt:{
    type:Date,
    default:Date.now,
},
})

const User=mongoose.model("User",userSchema);

export default User;