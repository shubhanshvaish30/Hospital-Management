import express from 'express'
import { addOrUpdateHealthProfile, getHealthProfile } from '../controllers/healthProfile.js';

const healthRouter=express.Router();

healthRouter.post("/profile", addOrUpdateHealthProfile);
healthRouter.get("/profile/:id", getHealthProfile);

export default healthRouter;