import express from "express";
import { googleLogin, login, sendClientKey, signup } from "../controllers/authController.js";

const authRouter=express.Router();


authRouter.get('/google', googleLogin)
authRouter.get('/getClientId',sendClientKey);
authRouter.post('/signup',signup);
authRouter.post('/login',login);


export default authRouter;
