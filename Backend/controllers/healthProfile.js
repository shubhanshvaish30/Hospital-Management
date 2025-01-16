import HealthProfile from "../models/HealthProfile.js";

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