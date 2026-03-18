import { Router } from "express";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", protect, sendMessage);
chatRouter.get("/", protect, getChats);
chatRouter.get("/:chatId/messages", protect, getMessages);
chatRouter.delete("/delete/:chatId", protect, deleteChat);

export default chatRouter;
