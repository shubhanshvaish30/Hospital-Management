import mongoose from 'mongoose';

// HealthRecord Schema
const healthRecordSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  records:[{appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  prescription: {
    type: String, // Cloudinary URL
  },
  testReport: {
    type: String, // Cloudinary URL
  },}]
}, { timestamps: true });

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;