import {Router} from "express";
import { registerUser, loginUser, logoutUser, verifyOTP, sendOTP } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

authRouter.post("/verify-otp", protect, verifyOTP);
authRouter.get("/send-otp", protect, sendOTP);

export default authRouter;