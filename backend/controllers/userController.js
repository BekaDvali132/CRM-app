const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc     Register new user
//@route    POST /api/users
//access    Private
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const errors = {};

  // Check if something is missing

  if (!name) {
    errors.name = "გთხოვთ მიუთითოთ სახელი";
  }
  if (!email) {
    errors.email = "გთხოვთ მიუთითოთ ელექტრონული ფოსტა";
  }
  if (!password) {
    errors.password = "გთხოვთ მიუთითოთ პაროლი";
  }
  if (!role) {
    errors.role = "გთხოვთ მიუთითოთ მომხმარებლის როლი";
  }

  if (Object.keys(errors).length > 0) {
    res.json({ 
        status:'unsuccess',
        errors: errors
     });
     return;
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(200).json({ 
        status:'unsuccess',
        message: "მომხმარებელი უკვე არსებობს"
     });
     return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  if (user) {
    res.status(201).json({
        status: 'success',
        data: {
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        }
    })
    return;
  } else {
    res.json({
        status: 'unsuccess',
        message: 'მომხმარებლის მონაცემები არასწორია'
    })
    return;
  }
});

//@desc     Authenticate a user
//@route    POST /api/users/login
//access    Private
const loginUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body;

    if (!email){
      res.json({
        status:'unsuccess',
        errors:{
          email: "გთხოვთ მიუთითოთ ელექტრონული ფოსტა"
      }
    })
  }

    const user = await User.findOne({email})

    if (!password){
      res.json({
        status:'unsuccess',
        errors:{
          password: "გთხოვთ მიუთითოთ პაროლი"
      }
    })
    }else if(user && (await bcrypt.compare(password,user.password))){
        res.json({
            status:'success',
            data: {
              _id: user.id,
              name: user.name,
              email: user.email,
              token: generateToken(user._id)
            }
        })
    }else if (user && !(await bcrypt.compare(password,user.password))){
        res.json({
            status:'unsuccess',
            errors:{
                password: "პაროლი არასწორია"
            }
        })
    } else {
      res.json({
        status:'unsuccess',
        errors:{
            alert: "დაფიქსირდა შეცდომა გთხოვთ სცადოთ თავიდან"
        }
    })
    }
});

//@desc     Get user data
//@route    Get /api/users/me
//access    Private
const getMe = asyncHandler(async (req, res) => {
  const {_id,name,email} = await User.findById(req.user.id)

  res.status(200).json({
    status:"success",
    data:{
      id:_id,
      name,
      email
    }
  })
  res.json({
    message: "User data Display",
  });
});

// Generate JWT

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
