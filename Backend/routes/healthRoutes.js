import express from 'express'
import { addOrUpdateHealthProfile, getHealthProfile, getHealthRecords } from '../controllers/healthProfile.js';

const healthRouter=express.Router();

healthRouter.post("/profile", addOrUpdateHealthProfile);
healthRouter.get("/profile/:id", getHealthProfile);
healthRouter.get('/records', getHealthRecords);

export default healthRouter;