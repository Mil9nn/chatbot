// OPTIMIZE: MULTIPLE RE-RENDERS ON EVERY KEY STROKE

import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { SendHorizonal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/lib/socket";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useThemeStore } from "@/store/useThemeStore";

const Home = () => {
  const { isSending, fetchAllMessages, sendMessage, messages, isLoading } = useMessageStore();
  const { authUser } = useAuthStore();
  const [inputMessage, setInputMessage] = useState("");
  const messageEndRef = useRef(null);

  const { isLight } = useThemeStore();

  // Memoize the socket handlers to prevent multiple registrations
  const handleReceiveMessage = useCallback((data) => {
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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!inputMessage.trim() || !authUser?._id) return;
    sendMessage({ userId: authUser._id, message: inputMessage });
    setInputMessage("");
  }, [inputMessage, authUser?._id, sendMessage]);

  if (!authUser) return <span className="text-white p-4">Loading...</span>;

  return (
    <div className="flex flex-col w-screen h-[calc(100vh-70px)]">
      {/* Chat Messages */}
      {isLoading ? (<MessageSkeleton />) : (<ScrollArea className="h-full overflow-y-auto">
        <div className="flex-1 px-4 py-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div key={idx} ref={messageEndRef} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-xs sm:max-w-md">
                  {!isUser && (
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 shrink-0">
                      <img
                        src="/bot-avatar.png"
                        alt="Bot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`rounded-lg p-3 text-sm break-words max-w-lg overflow-hidden ${isUser
                      ? "bg-rose-500 text-white"
                      : isLight ? "bg-[#edecec]" : "bg-zinc-800 text-zinc-100"
                      }`}
                  >
                    <ReactMarkdown
                      children={msg.content}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return !inline ? (
                            <pre className="bg-zinc-900 text-white p-3 rounded-lg overflow-auto text-sm">
                              <code {...props}>{children}</code>
                            </pre>
                          ) : (
                            <code className="bg-zinc-800 px-1 py-0.5 rounded">{children}</code>
                          );
                        },
                      }}
                    />
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 shrink-0">
                      <img
                        src={authUser.profilePic || "https://picsum.photos/200"}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>)}

      {/* Input */}
      <footer className={`p-4 border-t ${isLight ? "bg-[whitesmoke]" : "border-zinc-800 bg-zinc-900"}`}>
        {isSending && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="text-sm text-zinc-400 animate-pulse font-medium">
              Bot is typing<span className="animate-blink">...</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending}
            className={`flex-1 p-3 rounded-xl border shadow-md ${isLight ? "bg-[whitesmoke] text-bg-zinc-800" : "bg-zinc-800 border-zinc-700 text-white"} outline-none`}
          />
          <button
            onClick={handleSend}
            disabled={inputMessage.trim() === "" || isSending}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50"
          >
            <SendHorizonal className="text-white size-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;