const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Verify = require("../models/verifyModel");
const { sendMail, sendCodeMail, sendNewPasswordMail } = require("../functions/sendEmail");
const { generateExcel } = require("../functions/generateExcel");

//@desc     Register new user
//@route    POST /api/users
//access    Private
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, role, surname } = req.body;

  const errors = {};

  // Check if something is missing

  if (!name) {
    errors.name = "გთხოვთ მიუთითოთ სახელი";
  }
  if (!surname) {
    errors.surname = "გთხოვთ მიუთითოთ გვარი";
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
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    res.status(200).json({
      status: "unsuccess",
      errors: {
        email: "მომხმარებელი მითითებული მეილით უკვე არსებობს",
      },
    });
  }

  const userExists = await User.findOne({ name });

  if (userExists) {
    res.status(200).json({
      status: "unsuccess",
      errors: {
        name: "მომხმარებელი მითითებული დასახელებით უკვე არსებობს",
      },
    });

  }

  const generatedPassword = Math.random().toString(36).slice(-8);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(generatedPassword, salt);

  // Create user
  const user = await User.create({
    name,
    surname,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    sendMail(email, role, name, surname, generatedPassword);

    res.status(201).json({
      status: "success",
      data: {
        _id: user.id,
        name: user.name,
        surname: user.surname,
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

//@desc     Edit user
//@route    PUT /api/users/:id
//access    Private
const editUser = asyncHandler(async (req, res) => {
  const { name, email, role, surname, id } = req.body;

  const errors = {};

  // Check if something is missing

  if (!name) {
    errors.name = "გთხოვთ მიუთითოთ სახელი";
  }
  if (!surname) {
    errors.surname = "გთხოვთ მიუთითოთ გვარი";
  }
  if (!email) {
    errors.email = "გთხოვთ მიუთითოთ ელექტრონული ფოსტა";
  }
  if (!role) {
    errors.role = "გთხოვთ მიუთითოთ მომხმარებლის როლი";
  }

  if (Object.keys(errors).length > 0) {
    res.status(200).json({
      status: "unsuccess",
      errors: errors,
    });
    return;
  }

  // Check if user exists
  const emailExists = await User.find({ email });

  if (emailExists?.length > 0 && emailExists?.[0]?._id != id) {
    res.status(200).json({
      status: "unsuccess",
      errors: {
        email: "მომხმარებელი მითითებული მეილით უკვე არსებობს",
      },
    });
    return;
  }

  const userExists = await User.findById(id);

  if (!userExists) {
    res.status(200).json({
      status: "unsuccess",
      errors: {
        name: "მომხმარებელი არ არსებობს",
      },
    });
    return;
  }

  // Edit user
  const user = await User.findByIdAndUpdate(userExists._id, {
    name,
    email,
    role,
    surname
  });

  if (user) {
    // sendMail(email,role,name,generatedPassword)

    res.status(201).json({
      status: "success",
      data: {
        _id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        token: generateToken(user._id),
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
  const { email, password } = req.body;
  const errors = {};

  // Check if something is missing

  if (!email) {
    errors.email = "გთხოვთ მიუთითოთ ელ.ფოსტა";
  }
  if (!password) {
    errors.password = "გთხოვთ მიუთითოთ პაროლი";
  }

  if (errors?.email || errors?.password) {
    res.json({
      status: "unsuccess",
      errors: errors,
    });
  }

  // Find for user and if found, success

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      status: "success",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        surname: user.surname,
        role: user.role,
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
        email: "მომხმარებელი ამ ელ.ფოსტით ვერ მოიძებნა",
      },
    });
  }
});

//@desc     Get user data
//@route    Get /api/users/me
//access    Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, role, surname } = await User.findById(req.user.id);  

  res.status(200).json({
    status: "success",
    data: {
      id: _id,
      name,
      email,
      surname,
      role: role,
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

  if (role) {
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

//@desc     Delete user
//@route    Delete /api/users/
//access    Private
const deleteUser = asyncHandler(async (req, res) => {
  const role = await User.findById(req.user.id);

  let user;

  if (role && role.role === 1) {
    user = await User.findById(req.params.id);
    user.remove();
    res.status(200).send({
      status: "success",
    });
  } else {
    res.status(200).send({
      status: "unsuccess",
      message: "თქვენ არ გაქვთ ადმინის როლი",
    });
  }
});

//@desc     Get Specific user
//@route    Get /api/users/:id
//access    Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).send({
      status: "success",
      data: user,
    });
  } else {
    res.status(200).send({
      status: "unsuccess",
      message: "მომხმარებელი ვერ მოიძებნა",
    });
  }
});

const sendCode = async (req, res) => {
  const { email } = req.body;

  const errors = {};

  // Check if something is missing

  if (!email) {
    errors.email = "გთხოვთ მიუთითოთ ელ.ფოსტა";
  }

  // Check if user exists

  const userExists = await User.find({ email });

  if (userExists.length === 0) {
    errors.email = "მითითებული ელ.ფოსტით მომხმარებელი არ არსებობს";
  }

  if (Object.keys(errors).length > 0) {
    res.json({
      status: "unsuccess",
      errors: errors,
    });
    return;
  }

  const code = Math.random().toString(36).slice(-4);

  // Check if code exists for user and delete

  const verifyExists = await Verify.findOne({ user_id: userExists[0]._id });

  if (verifyExists) {
    verifyExists.remove();
  }

  const verifyCode = await Verify.create({
    user_id: userExists[0]._id,
    code,
    valid: new Date(new Date().getTime() + 300000),
  });

  if (verifyCode) {
    res.status(200).send({
      status: "success",
    });

    sendCodeMail(req.body.email, code);
  } else {
    res.status(200).send({
      status: "unsuccess",
    });
  }
};

const submitCode = async (req, res) => {
  const { code, password, repeat_password } = req.body;

  const verified = await Verify.findOne({ code });

  if (repeat_password !== password) {

    res.status(200).json({
      status: 'unsuccess',
      errors: {
        repeat_password: 'პაროლები უნდა ემთხვეოდეს'
      }
    })
    
  }

  if (verified) {

    const user = await User.findById(verified.user_id);

    if (user) {

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(user._id,{
      name:user.name,
      role: user.role,
      email: user.email,
      password: hashedPassword
    })


    if (updatedUser) {

      verified.remove()

      res.status(201).json({
        status: "success",
        data: {
          _id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          password: hashedPassword,
        },
      });

    } else {

      res.json({
        status: "unsuccess",
        message: "მომხმარებლის პაროლი აღდგენა ვერ შესრულდა",
      });

    }


    } else {

      res.json({
        status: "unsuccess",
        message: "მომხმარებლის პაროლი აღდგენა ვერ შესრულდა",
      });

      return;

    }
  } else {
    res.status(200).json({
      status: "unsuccess",
      message: "მომხმარებლის პაროლის აღდგენა ვერ შესრულდა ან არ აქვს აღდგენი უფლება",
    });
  }
};

const updateMe = async (req,res) => {
  const { name, email, role, id, password, repeat_password } = req.body;

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
  if (!password) {
    errors.password = "გთხოვთ მიუთითოთ მომხმარებლის ახალი პაროლი";
  }
  if (!repeat_password) {
    errors.repeat_password = "გთხოვთ ხელახლა მიუთითოთ მომხმარებლის ახალი პაროლი";
  }
  if (password !== repeat_password) {
    errors.repeat_password = "მითითებული პაროლები არ ემთხვევიან";
  }

  if (Object.keys(errors).length > 0) {
    res.json({
      status: "unsuccess",
      errors: errors,
    });
    return;
  }

  const user = await User.findById(id)

  if (user) {

    // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update user
    const updatedUser = await User.findByIdAndUpdate(user._id,{
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    })

    if (updatedUser) {
      res.status(200).json({
        status:'success',
        data: user
      })
    }
    
    res.status(200).json({
      status:'unsuccess',
      data: user
    })

  } else {

  }

  res.status(200).json({
    status:'success',
    data: user
  })
}

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
  deleteUser,
  getUser,
  editUser,
  sendCode,
  submitCode,
  updateMe
};
