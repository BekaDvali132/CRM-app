const asyncHandler = require("express-async-handler");

const Clinic = require("../models/clinicModel");

//@desc     Get Clinics
//@route    GET /api/clinics
//access    Private
const getClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find();

  res.status(200).json({
    status: "success",
    data: clinics,
  });
});

//@desc     Set Clinic
//@route    POST /api/clinics
//access    Private
const setClinic = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      status: "unsuccess",
      message: "გთხოვთ დაამატოთ ტექსტური ველი",
    });
  }

  const clinic = await Clinic.create({
    text: req.body.text,
  });
  res.status(200).json({
    status: "success",
    data: clinic,
  });
});

//@desc     Update Clinic
//@route    PUT /api/clinics/:id
//access    Private
const updateClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    res.status(200).json({
      status: "unsuccess",
      message: "კლინიკა ვერ მოიძებნა",
    });
  }

  const updatedClinic = await Clinic.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: false }
  );

  res.status(200).json({ 
    status: `success`,
    data: updatedClinic 
  });
});

//@desc     Delete Clinic
//@route    DELETE /api/clinics/:id
//access    Private
const deleteClinic = asyncHandler(async (req, res) => {
  
  const clinic = await Clinic.findById(req.params.id)

  if (!clinic) {
    res.status(200).json({
      status: "unsuccess",
      message: "კლინიკა ვერ მოიძებნა",
    });
  }

  clinic.remove()

  res.status(200).json({ 
    status: `success`,
    data:{
      id: req.params.id
    } 
  });

});

module.exports = {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
};
