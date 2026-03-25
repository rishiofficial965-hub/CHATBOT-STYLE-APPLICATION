import { askAI, generateChatTitle } from "../services/ai.service.js";
import { storeDocument } from "../services/vector.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body;

    let chat;

    if (!chatId) {
      const title = await generateChatTitle(message);
      chat = await chatModel.create({
        title,
        user: req.user._id,
        messages: [],
      });
    } else {
      chat = await chatModel.findOne({ _id: chatId, user: req.user._id });
      if (!chat) {
        return res.status(404).json({ success: false, msg: "Chat not found" });
      }
    }

    const userMessage = await messageModel.create({
      chat: chat._id,
      role: "user",
      content: message,
    });

    chat.messages.push(userMessage._id);

    const previousMessages = await messageModel
      .find({ chat: chat._id })
      .sort({ createdAt: 1 })
      .lean();

    const historyForAI = previousMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const aiResult = await askAI(historyForAI, {
      useWebSearch: true,
      latestQuery: message,
      userId: req.user._id.toString(),
    });

    const aiMessage = await messageModel.create({
      chat: chat._id,
      role: "ai",
      content: aiResult.content,
      sources: aiResult.sources || [],
    });

    chat.messages.push(aiMessage._id);
    await chat.save();

    storeDocument(`User: ${message}\nAssistant: ${aiResult.content}`, {
      chatId: chat._id.toString(),
      userId: req.user._id.toString(),
    }).catch((err) => console.error("Vector store error:", err.message));

    return res.status(200).json({
      success: true,
      chat: { _id: chat._id, title: chat.title },
      messages: [userMessage, aiMessage],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

export async function getChats(req, res) {
  try {
    const chats = await chatModel
      .find({ user: req.user._id })
      .select("_id title createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, chats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  try {
    const chat = await chatModel.findOne({ _id: chatId, user: req.user._id });

    if (!chat) {
      return res.status(404).json({ success: false, msg: "Chat not found" });
    }

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, chat, messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  try {
    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ success: false, msg: "Chat not found" });
    }

    await messageModel.deleteMany({ chat: chatId });

    return res.status(200).json({ success: true, msg: "Chat deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}
