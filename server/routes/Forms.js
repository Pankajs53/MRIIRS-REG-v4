const express = require("express");
const router = express.Router();

const { getAllUsers,getFormData,editFormData } = require("../controller/Forms");

router.get("/getAllUsers", getAllUsers);

router.post("/getFormData", getFormData);


router.post("/editFormData",editFormData)




module.exports = router;
