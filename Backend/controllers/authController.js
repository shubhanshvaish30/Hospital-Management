import User from '../models/User.js';
import oauth2client from '../utils/googleConfig.js';
import jwt from 'jsonwebtoken'
import axios from 'axios';

const googleLogin=async (req,res)=>{
    try{
        const {code}=req.query;
        const googleRes=await oauth2client.getToken(code);

        oauth2client.setCredentials(googleRes.tokens);

        const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
        const {email,name,picture}=userRes.data;
        let user=await User.findOne({email});
        if(!user){
            user=await User({email,userName:name,image:picture})
        }
        await user.save();

        const {_id}=user;
        const token=jwt.sign({_id,email},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_TIMEOUT
        });
        return res.json({success:true,message:"Account Created Successfully",user,token})
    }catch(err){
        console.log(err);
        return res.json({success:false,message:"Error"})
    }
}

const sendClientKey=async(req,res)=>{
    res.json({clientId:process.env.GOOGLE_CLIENT_ID})
}

export {googleLogin,sendClientKey}