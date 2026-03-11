import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";
import { otpTemplate } from "../utils/emailTemplate.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
        throw new ApiError(400, "User already exists");
    }
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        otp: {
            code: otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
        },
    });
    
    const htmlContent = otpTemplate(otp, name);
    await sendEmail(email, "Verify Your Email", `Your OTP is ${otp}`, htmlContent);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(
        new ApiResponse(201, { token }, "User registered successfully. Please verify your email.")
    );
});

export const verifyOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const userId = req.user?._id;

    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }

    const user = await userModel.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    if (user.otp.code !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.otp.expiresAt < Date.now()) {
        throw new ApiError(400, "OTP has expired");
    }

    user.isVerified = true;
    user.otp.code = undefined;
    user.otp.expiresAt = undefined;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully")
    );
});

export const sendOTP = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    const otp = generateOTP();
    user.otp = {
        code: otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
    };
    await user.save();

    const htmlContent = otpTemplate(otp, user.name);
    await sendEmail(user.email, "Verify Your Email", `Your OTP is ${otp}`, htmlContent);

    res.status(200).json(
        new ApiResponse(200, {}, "OTP sent successfully")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials");
    }

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
        new ApiResponse(200, { token }, "Logged in successfully")
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json(
        new ApiResponse(200, {}, "Logged out successfully")
    );
});