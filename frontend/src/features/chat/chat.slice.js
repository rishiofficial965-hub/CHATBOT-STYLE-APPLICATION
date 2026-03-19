import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendMessage as sendMessageApi,
  getChats as getChatsApi,
  getMessages as getMessagesApi,
  deleteChat as deleteChatApi,
} from "./services/chat.api";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getChatsApi();
      return data.chats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to load chats");
    }
  }
);

export const loadChat = createAsyncThunk(
  "chat/loadChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const data = await getMessagesApi(chatId);
      return { chat: data.chat, messages: data.messages };
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to load chat");
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, chatId }, { rejectWithValue }) => {
    try {
      const data = await sendMessageApi({ message, chatId });
      return { chat: data.chat, messages: data.messages };
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to send message");
    }
  }
);

export const removeChatThunk = createAsyncThunk(
  "chat/removeChat",
  async (chatId, { rejectWithValue }) => {
    try {
      await deleteChatApi(chatId);
      return chatId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to delete chat");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    currentChatId: null,
    messages: [],
    isLoading: false,
    isSending: false,
    error: null,
  },
  reducers: {
    startNewChat: (state) => {
      state.currentChatId = null;
      state.messages = [];
      state.error = null;
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loadChat.pending, (state) => { state.isSending = true; state.messages = []; })
      .addCase(loadChat.fulfilled, (state, action) => {
        state.isSending = false;
        state.currentChatId = action.payload.chat._id;
        state.messages = action.payload.messages;
      })
      .addCase(loadChat.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      .addCase(sendChatMessage.pending, (state) => { state.isSending = true; })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isSending = false;
        const { chat, messages } = action.payload;
        state.messages = [...state.messages, ...messages];
        state.currentChatId = chat._id;
        const exists = state.chats.find((c) => c._id === chat._id);
        if (!exists) {
          state.chats = [{ _id: chat._id, title: chat.title }, ...state.chats];
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      .addCase(removeChatThunk.fulfilled, (state, action) => {
        state.chats = state.chats.filter((c) => c._id !== action.payload);
        if (state.currentChatId === action.payload) {
          state.currentChatId = null;
          state.messages = [];
        }
      });
  },
});

export const { startNewChat, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;
