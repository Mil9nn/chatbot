import { MicOff, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";
import { useMessageStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useCallback } from "react";
import { useVoiceInput } from "@/store/useVoiceInput";

const ChatInputField = () => {
  const {
      isSending,
      sendMessage,
      inputMessage,
      setInputMessage,
    } = useMessageStore();

    const { authUser } = useAuthStore();
  const { isLight } = useThemeStore();

  const { startListening, isListening } = useVoiceInput((result) => {
      setInputMessage(result);
    });

    const handleSend = useCallback(() => {
    if (!inputMessage.trim() || !authUser?._id) return;
    sendMessage({ userId: authUser._id, message: inputMessage });
    setInputMessage("");
  }, [inputMessage, setInputMessage, authUser?._id, sendMessage]);

  return (
    <ScrollArea className="w-full min-w-[200px]">
          <footer
            className={`p-4 border-t ${
              isLight ? "bg-[whitesmoke]" : "border-zinc-800 bg-zinc-900"
            }`}
          >
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
                placeholder="Type your message... or speak"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isSending}
                className={`flex-1 p-3 rounded-xl border shadow-md ${
                  isLight
                    ? "bg-[whitesmoke] text-bg-zinc-800"
                    : "bg-zinc-800 border-zinc-700 text-white"
                } outline-none`}
              />
              <button
                onClick={startListening}
                className="p-2 cursor-pointer hover:text-indigo-500 transition disabled:opacity-50"
                title="Voice Input"
              >
                {isListening ? (
                  <MicOff className="text-red-500" />
                ) : (
                  <Mic className="size-8" />
                )}
              </button>
              <button
                onClick={handleSend}
                disabled={inputMessage.trim() === "" || isSending}
                className="p-3 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50"
              >
                <SendHorizonal className="text-white size-5" />
              </button>
            </div>
          </footer>
        </ScrollArea>
  )
}

export default ChatInputField
