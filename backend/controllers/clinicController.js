const asyncHandler = require("express-async-handler");

const Clinic = require("../models/clinicModel");
const User = require("../models/userModel");

//@desc     Get Clinics
//@route    GET /api/clinics
//access    Private
const getClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find({
    manager: req.user.id
  });

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
    manager: req.user.id
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

  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401).json({
      status: 'Unauthorized',
      message: 'მომხმარებელი ვერ მოიძებნა'
    })
  }

  // Make sure the logged in user matches the goal user
  if (clinic.manager.toString() !== user.id) {
    res.status(401).json({
      status:'unsuccess',
      message: 'მომხმარებელს რედაქტირების უფლება არ აქვს'
    })
  } else {

  const updatedClinic = await Clinic.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: false }
  );

  res.status(200).json({ 
    status: `success`,
    data: updatedClinic 
  });
}
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

  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401).json({
      status: 'Unauthorized',
      message: 'მომხმარებელი ვერ მოიძებნა'
    })
  }

  // Make sure the logged in user matches the goal user
  if (clinic.manager.toString() !== user.id) {
    res.status(401).json({
      status:'unsuccess',
      message: 'მომხმარებელს წაშლის უფლება არ აქვს'
    })
  } else {

  clinic.remove()

  res.status(200).json({ 
    status: `success`,
    data:{
      id: req.params.id
    } 
  });
}
});

module.exports = {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
};
