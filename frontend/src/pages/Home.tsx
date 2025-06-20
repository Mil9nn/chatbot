// TODO => OPTIMIZE: MULTIPLE RE-RENDERS ON EVERY KEY STROKE

import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useCallback } from "react";
import { Loader } from "lucide-react";
import { socket } from "@/lib/socket";

import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useThemeStore } from "@/store/useThemeStore";

import { useVoiceInput } from "@/store/useVoiceInput";
import VoiceOverlay from "@/components/VoiceOverlay";
import ChatContainer from "@/components/ChatContainer";
import EmptyChatState from "@/placeholders/EmptyChatState";
import ChatInputField from "@/components/ChatInputField";

type Message = {
  _id: string;
  userId: string;
  content: string;
  role: "user" | "bot";
  createdAt: string;
};

const Home = () => {
  const {
    fetchAllMessages,
    messages,
    isLoading,
    setInputMessage,
  } = useMessageStore();
  const { authUser } = useAuthStore();

  const { isLight } = useThemeStore();

  const { isListening } = useVoiceInput((result) => {
    setInputMessage(result);
  });

  // Memoize the socket handlers to prevent multiple registrations
  const handleReceiveMessage = useCallback((data: Message) => {
    useMessageStore.getState().initSocketListeners(data);
  }, []);

  useEffect(() => {
    // Clean up any existing listeners first
    socket.off("receive-message", handleReceiveMessage);
    // Add the new listener
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [handleReceiveMessage]);

  useEffect(() => {
    if (authUser) fetchAllMessages(authUser._id);
  }, [fetchAllMessages, authUser]);

  

  if (!authUser)
    return (
      <div
        className={`${
          isLight ? "text-black" : "text-white"
        } w-screen h-[calc(100vh-70px)] flex items-center justify-center`}
      >
        <Loader className="animate-spin" />
      </div>
    );

  console.log("Messages:", messages);

  return (
    <div className="flex flex-col h-[calc(100vh-70px)]">
      {/* Voice Input Overlay */}
      <VoiceOverlay isListening={isListening} />

      {/* Chat Messages */}
      <div className="h-full">
        {isLoading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <EmptyChatState />
        ) : (
          <ChatContainer />
        )}

        <ChatInputField />
      </div>
    </div>
  );
};

export default Home;
