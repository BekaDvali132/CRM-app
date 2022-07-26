const express = require("express");
const router = express.Router();
const {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
} = require("../controllers/clinicController");

const {protect} = require('../middleware/authMiddleware')

router.route("/").get(protect, getClinics).post(protect, setClinic);

router.route("/:id").put(protect, updateClinic).delete(protect, deleteClinic);

module.exports = router;
