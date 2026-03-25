import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY?.trim() });

/**
 * Search the web using Tavily API.
 * @param {string} query - The search query
 * @returns {Promise<Array<{title: string, url: string, snippet: string}>>}
 */
export async function searchWeb(query) {
  try {
    const response = await tvly.search(query, {
      maxResults: 5,
      searchDepth: "basic",
      includeAnswer: false,
    });

    return (response.results || []).map((r) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: r.content || "",
    }));
  } catch (error) {
    console.error("Tavily search error:", error.message);
    return [];
  }
}
