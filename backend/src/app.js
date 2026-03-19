import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { ApiError } from "./utils/ApiError.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    }
    console.error("🔥 Unexpected Error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        statusCode: 500
    });
});



export default app;
