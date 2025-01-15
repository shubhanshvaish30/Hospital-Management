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
        enum:['Upcoming','Completed'],
        default:'Upcoming'
    },
});

const Appointment=mongoose.model('Appointment',appointmentSchema);
export default Appointment;