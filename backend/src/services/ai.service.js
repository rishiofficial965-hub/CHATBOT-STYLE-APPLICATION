import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";
import { searchWeb } from "./search.service.js";
import { retrieveRelevantDocs } from "./vector.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

/**
 * Ask the AI with optional web search + vector retrieval context.
 * @param {Array|string} message - conversation history or a single message
 * @param {object} options
 * @param {boolean} options.useWebSearch - whether to search the web
 * @param {string}  options.latestQuery  - the raw latest user query (for search/retrieval)
 * @param {string}  options.userId       - the user's ID to filter vector results
 * @returns {Promise<{content: string, sources: Array}>}
 */
export async function askAI(message, { useWebSearch = true, latestQuery = "", userId = null } = {}) {
  try {
    let sources = [];
    let contextParts = [];

    // ── Run web search + vector retrieval in parallel ──
    if (useWebSearch && latestQuery) {
      // Filter vector docs by userId so users don't see each other's data
      const filter = userId ? { userId } : {};
      
      const [webResults, vectorDocs] = await Promise.all([
        searchWeb(latestQuery),
        retrieveRelevantDocs(latestQuery, filter),
      ]);

      sources = webResults;

      if (webResults.length > 0) {
        const webContext = webResults
          .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\nSource: ${r.url}`)
          .join("\n\n");
        contextParts.push(`## Web Search Results\n${webContext}`);
      }

      if (vectorDocs.length > 0) {
        const vecContext = vectorDocs
          .map((d, i) => `[${i + 1}] ${d.content}`)
          .join("\n\n");
        contextParts.push(`## Related Knowledge Base Context\n${vecContext}`);
      }
    }

    // ── Build messages ──
    const formattedMessages = [];

    if (contextParts.length > 0) {
      formattedMessages.push(
        new SystemMessage(
          `You are a helpful AI assistant engaging in a continuous conversation with the user. ` +
          `IMPORTANT: Always prioritize the conversation history above all else. If the user asks about something discussed previously (like their name), answer using the chat history.\n\n` +
          `You have also been provided with the following external search context. Use this context ONLY IF it is relevant to the user's latest query. If the external context is irrelevant or contradicts the conversation history, ignore it and rely on the chat history and your own knowledge.\n\n` +
          contextParts.join("\n\n")
        )
      );
    }

    if (Array.isArray(message)) {
      message.forEach((m) => {
        if (m.role === "user") formattedMessages.push(new HumanMessage(m.content));
        else formattedMessages.push(new AIMessage(m.content));
      });
    } else {
      formattedMessages.push(new HumanMessage(message));
    }

    const response = await geminiModel.invoke(formattedMessages);

    return { content: response.content, sources };
  } catch (error) {
    console.error("AI Error Full:", error);
    return { content: "AI failed to respond", sources: [] };
  }
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(
      "You are a chat title generator. Generate a concise and descriptive title for the given chat message.",
    ),
    new HumanMessage(message),
  ]);

  return response.content;
}
