/**
 * Backfill script — reads all existing chats from MongoDB
 * and stores them as embeddings in Pinecone so the RAG system
 * can retrieve earlier conversations.
 *
 * Usage: node backfill-vectors.js
 */
import "./src/config/env.js";
import connectToDb from "./src/config/database.js";
import chatModel from "./src/models/chat.model.js";
import messageModel from "./src/models/message.model.js";
import { storeDocument } from "./src/services/vector.service.js";

async function backfill() {
  await connectToDb();
  console.log("✅ Connected to MongoDB");

  const chats = await chatModel.find({}).lean();
  console.log(`📦 Found ${chats.length} chats to backfill\n`);

  let stored = 0;
  let failed = 0;

  for (const chat of chats) {
    try {
      const messages = await messageModel
        .find({ chat: chat._id })
        .sort({ createdAt: 1 })
        .lean();

      if (messages.length === 0) continue;

      // Group messages into user-AI pairs for meaningful context
      const pairs = [];
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === "user") {
          const userMsg = messages[i].content;
          const aiMsg = messages[i + 1]?.role === "ai" ? messages[i + 1].content : "";
          pairs.push(`User: ${userMsg}\nAssistant: ${aiMsg}`);
          if (aiMsg) i++; // skip the AI message
        }
      }

      for (const pair of pairs) {
        await storeDocument(pair, {
          chatId: chat._id.toString(),
          userId: chat.user.toString(),
        });
        stored++;
      }

      console.log(`✅ Chat "${chat.title}" — ${pairs.length} pairs stored`);
    } catch (err) {
      failed++;
      console.error(`❌ Chat "${chat.title}" failed:`, err.message);
    }
  }

  console.log(`\n🏁 Done! Stored: ${stored}, Failed: ${failed}`);
  process.exit(0);
}

backfill().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
