import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchChats,
  loadChat,
  sendChatMessage,
  removeChatThunk,
  startNewChat,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  const { messages, chats, currentChatId, isSending, isLoading } = useSelector(
    (state) => state.chat
  );

  const handleSendMessage = useCallback(
    (message) => {
      dispatch(sendChatMessage({ message, chatId: currentChatId }));
    },
    [dispatch, currentChatId]
  );

  const handleLoadChat = useCallback(
    (chatId) => {
      dispatch(loadChat(chatId));
    },
    [dispatch]
  );

  const handleStartNewChat = useCallback(() => {
    dispatch(startNewChat());
  }, [dispatch]);

  const handleDeleteChat = useCallback(
    (chatId) => {
      dispatch(removeChatThunk(chatId));
    },
    [dispatch]
  );

  const handleFetchChats = useCallback(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return {
    messages,
    chats,
    currentChatId,
    isSending,
    isLoading,
    sendMessage: handleSendMessage,
    loadChat: handleLoadChat,
    startNewChat: handleStartNewChat,
    deleteChat: handleDeleteChat,
    fetchChats: handleFetchChats,
  };
};
