import mongoose from "mongoose";

const healthProfileSchema=new mongoose.Schema({
    age:{
        type:Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    bloodPressure:{
        type:Number,
        required:true
    },
    bloodGroup:{
        type:String,
        required:true
    },
    chronic_Conditions:[
        {
            type:String
        }
    ],
    allergies:[
        {
            type:String
        }
    ],
    lifeStyle:{
        smoking:{
            type:Boolean,
            required:true
        },
        alcohol:{
            type:Boolean,
            required:true
        },
    },
    emergencyContact:{
        type:Number,
        required:true
    }
},{timestamps:true});
const HealthProfile=mongoose.model("HealthProfile",healthProfileSchema);
export default HealthProfile;