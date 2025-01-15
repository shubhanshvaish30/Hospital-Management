import express from "express";
import { googleLogin, sendClientKey } from "../controllers/authController.js";

const authRouter=express.Router();


authRouter.get('/google',googleLogin)
authRouter.get('/getClientId',sendClientKey);


export default authRouter;