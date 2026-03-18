import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function askAI(message) {
  try {
    const formattedMessages = Array.isArray(message)
      ? message.map((m) => {
          if (m.role === "user") return new HumanMessage(m.content);
          return new AIMessage(m.content);
        })
      : [new HumanMessage(message)];

    const response = await geminiModel.invoke(formattedMessages);

    return response.text;
  } catch (error) {
    console.error("AI Error Full:", error);
    return "AI failed to respond";
  }
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(
      "You are a chat title generator. Generate a concise and descriptive title for the given chat message.",
    ),
    new HumanMessage(message),
  ]);

  return response.text;
}
