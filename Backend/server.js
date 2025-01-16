import express from "express";
import cors from "cors";
import 'dotenv/config'
import authRouter from "./routes/authRoutes.js";
import { connectDB } from "./config/connectDB.js";
import appRouter from "./routes/appointmentRoutes.js";
import healthRouter from "./routes/healthRoutes.js";


const app=express();

const corsOptions={
    origin:'http://localhost:5173',
    credentials:true,
}

app.use(express.json());
app.use(cors(corsOptions))

// connect database
connectDB();

app.use('/auth',authRouter);
app.use('/appoint',appRouter);
app.use('/health',healthRouter);

app.get('/',(req,res)=>{
    res.send("Hello ji aagye")
})

const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server connected at ${PORT}`);
})