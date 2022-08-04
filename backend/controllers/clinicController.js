const asyncHandler = require("express-async-handler");

const Clinic = require("../models/clinicModel");
const User = require("../models/userModel");
const moment = require("moment");
const fs = require('fs')
const { body, validationResult } = require("express-validator");
const { generateExcel } = require("../functions/generateExcel");

//@desc     Get Clinics
//@route    GET /api/clinics
//access    Private
const getClinics = asyncHandler(async (req, res) => {
  const role = await User.findById(req.user.id);

  let clinics;

  if (role.role === 1) {
    if (req.query.order && req.query.field) {
      clinics = await Clinic.find({}).sort([
        [req.query.field, req.query.order == "ascend" ? 1 : -1],
      ]);
    } else if (req.query.start_date && req.query.end_date && !req.query.expired) {
      clinics = await Clinic.find({
        register_date: {
          $gte: req.query.start_date,
          $lt: req.query.end_date,
        },
      });
    } else if (req.query.manager) {
      clinics = await Clinic.find({
        manager: req.query.manager,
      });
    } else if (req.query.status) {
      clinics = await Clinic.find({
        status: req.query.status,
      });
    } else if (req.query.expired && req.query.start_date && req.query.end_date) {
      clinics = await Clinic.find({
        contract_date: {
          $gte: req.query.start_date,
          $lt: req.query.end_date,
        },
      });
      res.status(200).json({
        t: 'hh',
        status: "success",
        data: clinics,
        start: req.query.start_date,
        end: req.query.end_date
      });
    } else {
      clinics = await Clinic.find({});
    }
  } else {
    if (req.query.order && req.query.field) {
      clinics = await Clinic.find({
        manager: req.user.id,
      }).sort([[req.query.field, req.query.order == "ascend" ? 1 : -1]]);
    } else if (req.query.start_date && req.query.end_date) {
      clinics = await Clinic.find({
        manager: req.user.id,
        register_date: {
          $gte: req.query.start_date,
          $lte: req.query.end_date,
        },
      });
    } else if (req.query.manager) {
      clinics = await Clinic.find({
        manager: req.user.id,
        manager: req.query.manager,
      });
    } else if (req.query.status) {
      clinics = await Clinic.find({
        manager: req.user.id,
        status: req.query.status,
      });
    } else if (req.query.expired) {
      clinics = await Clinic.find({
        manager: req.user.id,
        contract_date: {
          $lte: moment().toDate(),
        },
      });
    } else {
      clinics = await Clinic.find({
        manager: req.user.id,
      });
    }
  }

  res.status(200).json({
    status: "success",
    data: clinics,
  });
});

//@desc     Get Clinic
//@route    GET /api/clinics/:id
//access    Private
const getClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: clinic,
  });
});

//@desc     Set Clinic
//@route    POST /api/clinics
//access    Private
const setClinic = asyncHandler(async (req, res) => {
  const {
    identity_code,
    phone_number,
    name,
    contact_person,
    status,
    register_date,
    contract_date,
    comment,
    manager,
  } = req.body;

  const errors = {};

  // Check if something is missing
  if (!phone_number) {
    errors.phone_number = "გთხოვთ მიუთითოთ ტელეფონის ნომერი";
  }
  if (!name) {
    errors.name = "გთხოვთ მიუთითოთ სახელი";
  }
  if (!status) {
    errors.status = "გთხოვთ მიუთითოთ სტატუსი";
  }
  if (!register_date) {
    errors.register_date = "გთხოვთ მიუთითოთ რეგისტრაციის თარიღი";
  }
  if (!manager) {
    errors.manager = "გთხოვთ მიუთითოთ მენეჯერი";
  }
  if (!contract_date) {
    errors.contract_date = "გთხოვთ მიუთითოთ კონტრაქტის თარიღი";
  }
  if (contract_date) {
    let contract = moment(contract_date).startOf("day");
    let date = moment().startOf("day");
    let diff = moment.duration(contract.diff(date)).asDays().toString();
    if (diff < 0) {
      errors.contract_date = `მიმდინარე თარიღი ${diff?.replace(
        "-",
        ""
      )} სცდება დღით კონტრაქტის თარიღის`;
    }
  }

  const clinicExists = await Clinic.find({ phone_number: phone_number });

  if (clinicExists.length !== 0) {
    errors.phone_number = `კლინიკა მითითებული ტელეფონის ნომრით უკვე არსებობს`;
  }

  if (Object.keys(errors).length > 0) {
    res.json({
      status: "unsuccess",
      errors: errors,
    });
    return;
  }

  const clinic = await Clinic.create(req.body);
  res.status(200).json({
    status: "success",
    data: clinic,
  });
});

//@desc     Update Clinic
//@route    PUT /api/clinics/:id
//access    Private
const updateClinic = asyncHandler(async (req, res) => {
  const {
    identity_code,
    phone_number,
    name,
    contact_person,
    status,
    register_date,
    contract_date,
    comment,
    manager,
    id,
  } = req.body;

  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    res.status(200).json({
      status: "unsuccess",
      message: "კლინიკა ვერ მოიძებნა",
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401).json({
      status: "Unauthorized",
      message: "მომხმარებელი ვერ მოიძებნა",
    });
  }

  // Make sure the logged in user is not admin and matches the clinic manager
  if (user.role !== 1 && clinic.manager.toString() !== user.id) {
    res.status(401).json({
      status: "unsuccess",
      message: "მომხმარებელს რედაქტირების უფლება არ აქვს",
    });
  } else {
    const errors = {};

    // Check if something is missing
    if (!phone_number) {
      errors.phone_number = "გთხოვთ მიუთითოთ ტელეფონის ნომერი";
    }
    if (!name) {
      errors.name = "გთხოვთ მიუთითოთ სახელი";
    }
    if (!status) {
      errors.status = "გთხოვთ მიუთითოთ სტატუსი";
    }
    if (!register_date) {
      errors.register_date = "გთხოვთ მიუთითოთ რეგისტრაციის თარიღი";
    }
    if (!manager) {
      errors.manager = "გთხოვთ მიუთითოთ მენეჯერი";
    }
    if (!contract_date) {
      errors.contract_date = "გთხოვთ მიუთითოთ კონტრაქტის თარიღი";
    }
    if (contract_date) {
      let contract = moment(contract_date).startOf("day");
      let date = moment().startOf("day");
      let diff = moment.duration(contract.diff(date)).asDays().toString();
      if (diff < 0) {
        errors.contract_date = `მიმდინარე თარიღი ${diff?.replace(
          "-",
          ""
        )} სცდება დღით კონტრაქტის თარიღის`;
      }
    }

    const clinicExists = await Clinic.find({ phone_number: phone_number });

    if (clinicExists.length > 0 && clinicExists._id === id) {
      errors.phone_number = `კლინიკა მითითებული ტელეფონის ნომრით უკვე არსებობს`;
    }

    if (Object.keys(errors).length > 0) {
      res.json({
        status: "unsuccess",
        errors: errors,
      });
      return;
    }

    const updatedClinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: false }
    );

    res.status(200).json({
      status: `success`,
      data: updatedClinic,
    });
  }
});

//@desc     Delete Clinic
//@route    DELETE /api/clinics/:id
//access    Private
const deleteClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    res.status(200).json({
      status: "unsuccess",
      message: "კლინიკა ვერ მოიძებნა",
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401).json({
      status: "Unauthorized",
      message: "მომხმარებელი ვერ მოიძებნა",
    });
  }

  // Make sure the logged in user is admin or matches the clinic manager
  if (user.role !== 1 && clinic.manager.toString() !== user.id) {
    res.status(401).json({
      status: "unsuccess",
      message: "მომხმარებელს წაშლის უფლება არ აქვს",
    });
  } else {
    clinic.remove();

    res.status(200).json({
      status: `success`,
      data: {
        id: req.params.id,
      },
    });
  }
});

const generateClinicsExcel = async (req, res) => {
  await generateExcel(req.body,res);
};

module.exports = {
  getClinics,
  setClinic,
  updateClinic,
  deleteClinic,
  getClinic,
  generateClinicsExcel,
};
