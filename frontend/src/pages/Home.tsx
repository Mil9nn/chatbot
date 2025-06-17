// OPTIMIZE: MULTIPLE RE-RENDERS ON EVERY KEY STROKE

import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState, useRef } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/lib/socket";

const Home = () => {
  const { isSending, fetchAllMessages, sendMessage, messages } = useMessageStore();
  const { authUser } = useAuthStore();
  const [inputMessage, setInputMessage] = useState("");
  const messageEndRef = useRef(null);

  const { initSocketListeners, cleanupSocketListeners } = useMessageStore();

  useEffect(() => {
    socket.on("receive-message", (data) => {
      initSocketListeners(data);
    });

    return () => {
      cleanupSocketListeners();
    }
  }, []);


  useEffect(() => {
    if (authUser) fetchAllMessages(authUser._id);
  }, [fetchAllMessages, authUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendMessage({ userId: authUser._id, message: inputMessage });
    setInputMessage("");
  };

  if (!authUser) return <span className="text-white p-4">Loading...</span>;

  return (
    <div className="flex flex-col w-screen h-[calc(100vh-152px)] bg-zinc-950 text-white">
      {/* Chat Messages */}
      <ScrollArea className="h-full">
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
                      : "bg-zinc-800 text-zinc-100"
                      }`}
                  >
                    {msg.content}
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
      </ScrollArea>

      {/* Input */}
      <footer className="p-4 border-t border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50"
          >
            {isSending ? <Loader2 className="animate-spin" /> : <SendHorizonal className="text-white size-5" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
