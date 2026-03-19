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
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const isUserExist = await userModel.findOne({ 
        $or: [{ email }, { username }]
    });

    if (isUserExist) {
        const field = isUserExist.email === email ? "Email" : "Username";
        throw new ApiError(400, `${field} already exists`);
    }
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        name,
        email,
        username,
        password: hashedPassword,
        otp: {
            code: otp,
            expiresAt: Date.now() + 5 * 60 * 1000, // Increased to 5 minutes
        },
    });
    
    const htmlContent = otpTemplate(otp, name);
    try {
        await sendEmail(email, "Verify Your Email", `Your OTP is ${otp}`, htmlContent);
    } catch (error) {
        console.error("❌ Registration email failed:", error.message);
        // We still proceed so the user is created, but they might need to resend OTP
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
        avatar: user.avatar,
    };

    res.status(201).json(
        new ApiResponse(201, { user: userResponse, token }, "User registered successfully. Please verify your email.")
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
        expiresAt: Date.now() + 5 * 60 * 1000, // Increased to 5 minutes
    };
    await user.save();

    const htmlContent = otpTemplate(otp, user.name);
    await sendEmail(user.email, "Verify Your Email", `Your OTP is ${otp}`, htmlContent);

    res.status(200).json(
        new ApiResponse(200, {}, "OTP sent successfully")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
        throw new ApiError(400, "Login identifier and password are required");
    }

    const user = await userModel.findOne({
        $or: [
            { email: loginIdentifier.toLowerCase() },
            { username: loginIdentifier.toLowerCase() }
        ]
    }).select("+password");

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
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
        avatar: user.avatar,
    };

    res.status(200).json(
        new ApiResponse(200, { user: userResponse, token }, "Logged in successfully")
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(200).json(
        new ApiResponse(200, {}, "Logged out successfully")
    );
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(
        new ApiResponse(200, { user }, "User fetched successfully")
    );
});