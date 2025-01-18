import HealthProfile from "../models/HealthProfile.js";
import HealthRecord from '../models/HealthRecord.js';
import Appointment from '../models/Appointment.js';

// Controller to add health profile details for the first time
export const addOrUpdateHealthProfile = async (req, res) => {
    try {
      const { userId, age, height, weight, bloodPressure, bloodGroup, chronic_Conditions, allergies, lifeStyle, emergencyContact } = req.body;
  
      // Check if a profile already exists for this user
      let profile = await HealthProfile.findOne({ userId });
  
      // If profile exists, update it
      if (profile) {
        profile.age = age;
        profile.height = height;
        profile.weight = weight;
        profile.bloodPressure = bloodPressure;
        profile.bloodGroup = bloodGroup;
        profile.chronic_Conditions = chronic_Conditions;
        profile.allergies = allergies;
        profile.lifeStyle = lifeStyle;
        profile.emergencyContact = emergencyContact;
  
        const updatedProfile = await profile.save();
        return res.status(200).json({ message: "Health profile updated successfully", data: updatedProfile });
      } else {
        // If profile doesn't exist, create a new one
        const newProfile = new HealthProfile({
          userId,
          age,
          height,
          weight,
          bloodPressure,
          bloodGroup,
          chronic_Conditions,
          allergies,
          lifeStyle,
          emergencyContact
        });
  
        const savedProfile = await newProfile.save();
        return res.status(201).json({ message: "Health profile added successfully", data: savedProfile });
      }
    } catch (error) {
      res.status(500).json({ message: "Error adding/updating health profile", error: error.message });
    }
};

export const getHealthProfile = async (req, res) => {
    try {
        const { id } = req.params;        
        const userId=id;
        const profile = await HealthProfile.findOne({ userId: id });

        if (!profile) {
            return res.status(404).json({ message: "Health profile not found" });
        }

        res.status(200).json({ message: "Health profile fetched successfully", data: profile });
    } catch (error) {
        res.status(500).json({ message: "Error fetching health profile", error: error.message });
    }
};

export const getHealthRecords = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch the health record document for the user
    const healthRecordDoc = await HealthRecord.findOne({ userId }).populate({
      path: "records.appointmentId", // Populate the appointmentId
      select: "date", // Fetch only the date field
    });

    if (!healthRecordDoc) {
      return res.status(404).json({ success: false, message: "No health records found for the user" });
    }

    // Extract records and map the response
    const response = healthRecordDoc.records.map((record) => ({
      id: record._id,
      appointmentId: record.appointmentId?._id,
      disease: record.disease,
      prescription: record.prescription,
      testReport: record.testReport,
      date: record.appointmentId?.date, // Extracted date from populated appointmentId
      type: record.prescription ? "Prescription" : "Test Report", // Determine type dynamically
    }));

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

