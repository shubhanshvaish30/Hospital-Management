import User from '../models/User.js';
import oauth2client from '../utils/googleConfig.js';
import jwt from 'jsonwebtoken'
import axios from 'axios';
import bcrypt from 'bcrypt'

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

const signup = async (req, res) => {
  try {
    // console.log(req.body);
    
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      userName,
    });

    await user.save();

    const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    return res.json({
      success: true,
      message: 'User registered successfully',
      user: { _id: user._id, email, userName },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login handler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user: { _id: user._id, email, userName: user.userName },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export {googleLogin,sendClientKey,signup,login}
