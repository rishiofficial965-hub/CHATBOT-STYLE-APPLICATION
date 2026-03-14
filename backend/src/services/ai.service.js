import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY
});

export async function askAI() {
  try {
    const response = await model.invoke("hello");
    console.log("AI Response:", response.text);
    return response.text;
  } catch (error) {
    console.error("AI Error Full:", error);
  }
}