import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(errorHandler(400, "Email already in use"));

    // Hash password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    // Verify password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "JWT_SECRET is not defined"));
    }

    // Generate token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "User logged in successfully", token });
  } catch (error) {
    next(error);
  }
};
