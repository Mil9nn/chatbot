// OPTIMIZE: MULTIPLE RE-RENDERS ON EVERY KEY STROKE

import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState } from "react";
import { SendHorizonal, Bot, User, Loader2 } from "lucide-react";

const Home = () => {
  const { isSending, isLoading, fetchAllMessages, sendMessage, messages } = useMessageStore();
  const { authUser } = useAuthStore();
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (authUser) {
      fetchAllMessages(authUser._id);
    }
  }, [fetchAllMessages, authUser]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendMessage({ userId: authUser._id, message: inputMessage });
    setInputMessage("");
  };

  if (!authUser) return <span>Loading...</span>;

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-zinc-900 text-white">
      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-center gap-2 max-w-[75%] p-3 rounded-xl ${isUser
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-zinc-100"
                  }`}
              >
                {!isUser && <Bot className="size-4 opacity-70" />}
                <p className="break-words break-all w-full max-w-md">{msg.content}</p>
                {isUser && <User className="size-4 opacity-70" />}
              </div>
            </div>
          );
        })}
      </main>

      {/* Input */}
      <footer className="p-4 border-t border-zinc-700 bg-zinc-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none"
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
