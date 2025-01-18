import mongoose from 'mongoose'

const appointmentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    hospital:{
        type:String,
        required:true
    },
    doctor:{
        type:String,
        required:true
    },
    disease:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Upcoming','Cancelled','Expired'],
        default:'Upcoming'
    },
    prescription:{
        type:String
    },
    testReport:{
        type:String
    }
});

const Appointment=mongoose.model('Appointment',appointmentSchema);
export default Appointment;