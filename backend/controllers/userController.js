const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const {sendMail} = require('../functions/sendEmail');

//@desc     Register new user
//@route    POST /api/users
//access    Private
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  const errors = {};

  // Check if something is missing

  if (!name) {
    errors.name = "გთხოვთ მიუთითოთ სახელი";
  }
  if (!email) {
    errors.email = "გთხოვთ მიუთითოთ ელექტრონული ფოსტა";
  }
  if (!role) {
    errors.role = "გთხოვთ მიუთითოთ მომხმარებლის როლი";
  }

  if (Object.keys(errors).length > 0) {
    res.json({
      status: "unsuccess",
      errors: errors,
    });
    return;
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(200).json({
      status: "unsuccess",
      message: "მომხმარებელი უკვე არსებობს",
    });
    return;
  }

  const generatedPassword = Math.random().toString(36).slice(-8);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(generatedPassword, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    sendMail(email,role,name,generatedPassword)

    res.status(201).json({
              status: "success",
              data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                password: hashedPassword,
              },
            });
  } else {
    res.json({
      status: "unsuccess",
      message: "მომხმარებლის მონაცემები არასწორია",
    });
    return;
  }
});

//@desc     Authenticate a user
//@route    POST /api/users/login
//access    Private
const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const errors = {};

  // Check if something is missing

  if (!name) {
    errors.name = "გთხოვთ მიუთითოთ დასახელება";
  }
  if (!password) {
    errors.password = "გთხოვთ მიუთითოთ პაროლი";
  }

  if (errors?.name || errors?.password) {
    res.json({
      status: "unsuccess",
      errors: errors,
    });
  }

  // Find for user and if found, success

  const user = await User.findOne({ name });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      status: "success",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } else if (user && !(await bcrypt.compare(password, user.password))) {
    res.json({
      status: "unsuccess",
      errors: {
        password: "პაროლი არასწორია",
      },
    });
  } else {
    res.json({
      status: "unsuccess",
      errors: {
        name: "მომხმარებელი ამ დასახელებით ვერ მოიძებნა",
      },
    });
  }
});

//@desc     Get user data
//@route    Get /api/users/me
//access    Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      id: _id,
      name,
      email,
    },
  });

  res.json({
    message: "User data Display",
  });
});

//@desc     Get every user data
//@route    Get /api/users/
//access    Private
const getUsers = asyncHandler(async (req, res) => {
  const role = await User.findById(req.user.id);

  let users;

  if (role && role.role === 1) {
    users = await User.find({});
    res.status(200).send({
      status: "success",
      data: users,
    });
  } else {
    res.status(200).send({
      status: "unsuccess",
      message: "თქვენ არ გაქვთ ადმინის როლი",
    });
  }
});

// Generate JWT

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
};
