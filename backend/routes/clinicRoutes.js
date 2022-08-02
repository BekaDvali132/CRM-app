const express = require("express");
const router = express.Router();
const {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
  getClinic,
  generateClinicsExcel
} = require("../controllers/clinicController");

const {protect} = require('../middleware/authMiddleware')

router.route("/").get(protect, getClinics).post(protect, setClinic);

router.route('/generate').post(protect, generateClinicsExcel)

router.route("/:id").put(protect, updateClinic).delete(protect, deleteClinic).get(protect, getClinic);

module.exports = router;
