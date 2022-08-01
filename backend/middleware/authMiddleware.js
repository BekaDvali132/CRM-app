const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({
        status: "Unauthorized",
      });
    }
  }

  if (!token) {
    res.status(401).send({
      status: "Unauthorized",
    });
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (req.user.role===1) {
        next();
      } else {
        res.status(403).send({
          status: "თქვენ არ გაქვთ ადმინის როლი",
        });
      }
      
    } catch (error) {
      console.log(error);
      res.status(401).send({
        status: "Unauthorized",
      });
    }
  }

  if (!token) {
    res.status(401).send({
      status: "Unauthorized",
    });
  }
});

module.exports = { protect, protectAdmin };
