import { askAI, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chat: chatId } = req.body;

    let chat;

    if (!chatId) {
      const title = await generateChatTitle(message);

      chat = await chatModel.create({
        title,
        user: req.user._id,
        messages: [],
      });
    } else {
      chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          success: false,
          msg: "Chat not found",
        });
      }
    }

    const result = await askAI(message);

    const userMessage = await messageModel.create({
      chat: chat._id,
      role: "user",
      content: message,
    });

    const aiMessage = await messageModel.create({
      chat: chat._id,
      role: "ai",
      content: result,
    });

    chat.messages.push(userMessage._id, aiMessage._id);
    await chat.save();

    return res.status(200).json({
      success: true,
      chat,
      messages: [userMessage, aiMessage],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

export async function getChats(req, res) {
  try {
    const chats = await chatModel.find({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  try {
    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        msg: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  try {
    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    await messageModel.deleteMany({
      chat: chatId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        msg: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
}
