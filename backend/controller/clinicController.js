const asyncHandler = require('express-async-handler')

//@desc     Get Clinics
//@route    GET /api/clinics
//access    Private
const getClinics = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get Clinics" });
});

//@desc     Set Clinic
//@route    POST /api/clinics
//access    Private
const setClinic = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400).json({
            status: "unsuccess",
            message: "გთხოვთ დაამატოთ ტექსტური ველი"
        })
    }
  res.status(200).json({ message: "Set Clinic" });
});

//@desc     Update Clinic
//@route    PUT /api/clinics/:id
//access    Private
const updateClinic = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update Clinic ${req.params.id}` });
});

//@desc     Delete Clinic
//@route    DELETE /api/clinics/:id
//access    Private
const deleteClinic = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete Clinic ${req.params.id}` });
});

module.exports = {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
};
