const Patient = require("../models/Patient");

// Search for a patient by firstName or uniqueId, considering variations in field names
exports.searchPatient = async (req, res) => {
    try {
        const { search } = req.body;
        console.log("From backend search:", search);

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search term is required",
            });
        }

        const allUsers = await Patient.find({});
        console.log("All patient are",allUsers);

        // Construct regex for case-insensitive and whole word match on firstName
        const firstNameRegex = new RegExp(`\\b${search}\\b`, 'mi');

        const query = {
            $or: [
                { uniqueId: search },
                { "formData.firstName": { $regex: firstNameRegex } },
                { "formData.fullName": { $regex: firstNameRegex } },
                // Add more variations as needed
            ]
        };

        console.log("Query:", query); // Log the query

        const patients = await Patient.find(query);
        console.log("Patients found:", patients);

        if (patients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No patients found matching the search criteria",
            });
        }

        

        // Respond with patient data
        res.status(200).json({
            success: true,
            message: "Patients found",
            data: patients,
        });
    } catch (error) {
        console.error("Error in searching patients:", error);
        res.status(500).json({
            success: false,
            message: "Error in searching patients",
            error: error.message,
        });
    }
};



// const Patient = require('../models/Patient'); // Replace with your actual Patient model import

exports.editPrescription = async (req, res) => {
    const { patientId } = req.params;
    const { prescription } = req.body;
  
    try {
      const patient = await Patient.findById(patientId);
  
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
  
      const newPercription = {
        prescription:prescription,
        date:new Date(),
      }

      patient.prescriptionHistory.push(newPercription)
  
    //   // Update prescription history with current prescription if exists
    //   if (patient.prescription) {
    //     patient.prescriptionHistory.unshift({  // Adding the current prescription to the front of the array
    //       prescription: patient.prescription,
    //       date: patient.prescriptionDate // Assuming prescriptionDate is already set
    //     });
    //   }
  
    //   // Update current prescription with new value and set prescriptionDate
    //   patient.prescription = prescription;
    //   patient.prescriptionDate = new Date(); // Set current date for the new prescription
  
      await patient.save();
  
      // Prepare response data with updated prescription history
      const updatedPatient = await Patient.findById(patientId);

      console.log(updatedPatient)
      res.status(200).json({ success: true, data: updatedPatient, message: 'Prescription saved successfully' });
    } catch (error) {
      console.error('Error editing prescription:', error);
      res.status(500).json({ success: false, message: 'Error editing prescription. Please try again.' });
    }
  };
  
