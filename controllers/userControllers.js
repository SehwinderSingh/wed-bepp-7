const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const signupUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      date_of_birth,
      accountType,
    } = req.body || {};

    const requiredFields = [
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      date_of_birth,
      accountType,
    ];

    const hasMissingField = requiredFields.some(
      (field) => typeof field !== "string" || field.trim() === "",
    );

    if (hasMissingField) {
      return res.status(400).json({
        error: "Please add all fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    if (!process.env.SECRET) {
      throw new Error("SECRET is missing from .env");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      phoneNumber,
      gender,
      date_of_birth,
      accountType,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      email: user.email,
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password.trim() === ""
    ) {
      return res.status(400).json({
        error: "Please add all fields",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    if (!process.env.SECRET) {
      throw new Error("SECRET is missing from .env");
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      email: user.email,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
};
