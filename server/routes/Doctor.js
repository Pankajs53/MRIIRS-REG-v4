const express = require("express");
const router = express.Router();

const { searchPatient,editPrescription } = require("../controller/Doctor");

router.post("/searchPatient", searchPatient);

router.put('/editPrescription/:patientId',editPrescription);

module.exports = router;
