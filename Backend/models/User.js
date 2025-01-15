import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        trim:true,
        required:[true,"Please enter your name!"]

    },
    email:{
        type:String,
        trim:true,
        required:[true,"Please enter your Email!"],
        unique:true,
    },
    // password:{
    //     type:String,
    //     required:true
    // }
    image:{
        type:String
    }
})

const User=mongoose.model.User || mongoose.model('User',userSchema);
export default User;