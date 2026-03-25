import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";

// ── Embeddings model ──
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

// ── Pinecone client ──
const pc = new Pinecone({ apiKey: process.env.PINECONE_API });

const INDEX_NAME = process.env.PINECONE_INDEX || "chatbot-index";

let _vectorStore = null;

/**
 * Get or initialize the PineconeStore backed vector store.
 */
async function getVectorStore() {
  if (_vectorStore) return _vectorStore;

  const index = pc.index(INDEX_NAME);
  _vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });
  return _vectorStore;
}

/**
 * Retrieve relevant documents from Pinecone for a given query, filtered by metadata.
 * @param {string} query
 * @param {object} filter - Pinecone metadata filter (e.g., { userId: "..." })
 * @param {number} k - number of results to return
 * @returns {Promise<Array<{content: string, metadata: object}>>}
 */
export async function retrieveRelevantDocs(query, filter = {}, k = 3) {
  try {
    const store = await getVectorStore();
    const results = await store.similaritySearch(query, k, filter);

    return results.map((doc) => ({
      content: doc.pageContent,
      metadata: doc.metadata || {},
    }));
  } catch (error) {
    console.error("Pinecone retrieval error:", error.message);
    return [];
  }
}

/**
 * Store a document (text + metadata) as an embedding in Pinecone.
 * @param {string} text
 * @param {object} metadata
 */
export async function storeDocument(text, metadata = {}) {
  try {
    const store = await getVectorStore();
    await store.addDocuments([
      new Document({
        pageContent: text,
        metadata,
      }),
    ]);
  } catch (error) {
    console.error("Pinecone store error:", error.message);
  }
}
