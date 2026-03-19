import axios from "axios";

const api = axios.create({
  baseURL: "/api/chats",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const sendMessage = async ({ message, chatId }) => {
  const response = await api.post("/message", { message, chatId });
  return response.data;
};

export const getChats = async () => {
  const response = await api.get("/");
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/${chatId}/messages`);
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/delete/${chatId}`);
  return response.data;
};
