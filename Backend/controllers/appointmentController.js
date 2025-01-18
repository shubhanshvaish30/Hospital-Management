import Appointment from "../models/Appointment.js";
import HealthRecord from "../models/HealthRecord.js";

export const scheduleAppointment = async (req, res) => {
  try {
    const { userId, date, hospital, doctor, disease } = req.body;

    // Validate input
    if (!userId || !date || !hospital || !doctor || !disease) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new appointment
    const newAppointment = await Appointment.create({
      userId,
      date,
      hospital,
      doctor,
      disease,
    });

    res.status(201).json({
      message: 'Appointment scheduled successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling appointment', error });
  }
};

export const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
  
      // Find the appointment and update its status to 'Cancelled'
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'Cancelled' },
        { new: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      res.status(200).json({
        message: 'Appointment cancelled successfully',
        appointment: updatedAppointment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error cancelling appointment', error });
    }
  };

  export const rescheduleAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { newDate } = req.body;
  
      if (!newDate) {
        return res.status(400).json({ message: 'New date is required' });
      }
  
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { date: newDate },
        { new: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      res.status(200).json({
        message: 'Appointment rescheduled successfully',
        appointment: updatedAppointment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error rescheduling appointment', error });
    }
  };

  export const getAppointmentsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const appointments = await Appointment.find({ userId }).sort({ date: 1 });
  
      if (!appointments.length) {
        return res.status(404).json({ message: 'No appointments found for this user' });
      }
  
      res.status(200).json({ appointments });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments', error });
    }
  };
  
  export const saveReports = async (req, res) => {
    try {
      const { id } = req.params; // Appointment ID
      const { prescription, testReport } = req.body; // URLs from the frontend
  
      // Find the appointment by ID
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
  
      appointment.prescription = prescription || appointment.prescription;
      appointment.testReport = testReport || appointment.testReport;
      await appointment.save();
      // Create the new record object
      const newRecord = {
        appointmentId: appointment._id,
        disease: appointment.disease,
        prescription,
        testReport,
      };
  
      // Update or create a health record
      const healthRecord = await HealthRecord.findOneAndUpdate(
        { userId: appointment.userId }, // Find health record by userId
        { $push: { records: newRecord } }, // Push the new record into the records array
        { upsert: true, new: true } // Create a new document if none exists
      );
  
      res.status(200).json({
        success: true,
        message: 'Reports saved successfully',
        healthRecord,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  