const express = require("express");
const router = express.Router();
const {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
} = require("../controller/clinicController");

router.route("/").get(getClinics).post(setClinic);

router.route("/:id").put(updateClinic).delete(deleteClinic);

module.exports = router;
