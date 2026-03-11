import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat reference is required"],
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: [true, "Role is required"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
    },
    sources: [
      {
        title: { type: String },
        url: { type: String },
        snippet: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
