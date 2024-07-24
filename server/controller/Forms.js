const Patient = require("../models/Patient")
const User = require("../models/User");


// get all user
exports.getAllUsers = async(req,res) =>{
    try{
        const users = await User.find({}).sort();

        console.log("All users are",users);

        if(users.length<=0){
            return res.status(201).json({
                success:true,
                message:"There are no registered Users."
            })
        }

        const data = users.map((user)=>({
            uniqueId: user.uniqueId,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber
        }))

        console.log("All users are",data);

        return res.status(200).json({
            success:true,
            data:data,
            message:"Users Fetched Successfully"
        })
    }catch(error){
        console.log("Error in getAllUser Api",error)
        return res.status(400).json({
            success:false,
            message:"Error in Get All User"
        })
    }
}


// get form specific data
exports.getFormData = async (req, res) => {
    try {
        const { category, uniqueId } = req.body;

        console.log("Category is", category);
        console.log("unique id is", uniqueId);

        // First search in Patient if data is available
        const data = await Patient.findOne({
            $and: [
                { uniqueId: uniqueId },
                { formCategory: category }
            ]
        });

        console.log(data)

        if (!data) {
            // If not found in Patient, look into the User model
            const user = await User.findOne({ uniqueId: uniqueId });
            if (user) {
                console.log("User found from registration", user);
                return res.status(200).json({
                    success: true,
                    message: "User found",
                    data: user
                });
            } else {
                // If user is also not found
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        }

        // Data found in Patient
        return res.status(200).json({
            success: true,
            message: "User found",
            data: data
        });

    } catch (error) {
        console.log("Error in getFormData API:", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching form specific data"
        });
    }
};



// edit form specific data

// exports.editFormData = async (req, res) => {
//     try {
//         // Extract formdata and category from the request body
//         const { formData, category, fullName, email, phoneNumber, uniqueId, dob, prescription } = req.body;

//         console.log("FormData is", formData);

//         // Find the document by email and category
//         const user = await Patient.findOne({ email: email, category: category });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // Update the prescription history
//         const newPrescriptionEntry = {
//             prescription: prescription,
//             date: new Date()
//         };

//         // Push the new prescription entry to the prescriptionHistory array
//         user.prescriptionHistory.push(newPrescriptionEntry);

//         // Update other fields
//         user.formData = formData;
//         user.fullName = fullName;
//         user.phoneNumber = phoneNumber;
//         user.uniqueId = uniqueId;
//         user.dob = dob;
//         user.prescription = prescription;

//         // Save the updated user document
//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: "Data updated successfully",
//             data: user
//         });
//     } catch (error) {
//         console.log("Error in editFormData API", error);
//         return res.status(401).json({
//             success: false,
//             message: "Error in Editing Data"
//         });
//     }
// };

// exports.editFormData = async (req, res) => {
//     try {
//         // Extract formdata and category from the request body
//         const { formData, category, fullName, email, phoneNumber, uniqueId, dob, prescription } = req.body;

//         console.log("FormData is", formData);

//         // Prepare the update object
//         const update = {
//             formData: formData,
//             fullName: fullName,
//             email: email,
//             phoneNumber: phoneNumber,
//             generatedId: uniqueId,
//             dob: dob,
//             prescription: prescription
//         };

//         // Prepare the prescription history entry
//         const newPrescriptionEntry = {
//             prescription: prescription,
//             date: new Date()
//         };

//         // Find the document by email and category, or create a new one if it doesn't exist
//         let user = await Patient.findOneAndUpdate(
//             { email: email, formCategory: category },
//             {
//                 $set: update,
//                 $push: { prescriptionHistory: newPrescriptionEntry }
//             },
//             { new: true, upsert: true } // Return the updated document and create a new one if it doesn't exist
//         );


//         console.log("Here we are");

//         // Handle the case when a new document is created
//         if (!user) {
//             // Create a new user document if it doesn't exist
//             user = new Patient({
//                 formCategory: category,
//                 formData: formData,
//                 fullName: fullName,
//                 email: email,
//                 phoneNumber: phoneNumber,
//                 generatedId: uniqueId,
//                 dob: dob,
//                 prescription: prescription,
//                 prescriptionHistory: [newPrescriptionEntry]
//             });

//             // Save the new user document
//             await user.save();
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Data updated successfully",
//             data: user
//         });
//     } catch (error) {
//         console.log("Error in editFormData API", error);
//         return res.status(401).json({
//             success: false,
//             message: "Error in Editing Data"
//         });
//     }
// };

exports.editFormData = async (req, res) => {
    try {
        // Extract formdata and category from the request body
        const { formData, category, fullName, email, phoneNumber, uniqueId, dob, prescription } = req.body;

        console.log("FormData is", formData);

        if (!email || !category) {
            return res.status(400).json({
                success: false,
                message: "Email and category cannot be null"
            });
        }

        // Prepare the update object
        const update = {
            formData: formData,
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            uniqueId: uniqueId,
            dob: dob,
            prescription: prescription
        };

        // Prepare the prescription history entry
        const newPrescriptionEntry = {
            prescription: prescription,
            date: new Date()
        };

        console.log("Here");

        // Find the document by email and category and update it, or create a new one if it doesn't exist
        let user = await Patient.findOneAndUpdate(
            { email: email, formCategory: category },
            { 
                $set: update,
                $push: { prescriptionHistory: newPrescriptionEntry } 
            },
            { new: true, upsert: true } // Return the updated document and create a new one if it doesn't exist
        );

        return res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: user
        });
    } catch (error) {
        console.log("Error in editFormData API", error);
        return res.status(500).json({
            success: false,
            message: "Error in Editing Data"
        });
    }
};





