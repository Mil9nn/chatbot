import React, { useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMessageStore } from "@/store/useMessageStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";

const ChatContainer = () => {
  const { messages } = useMessageStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const { isLight } = useThemeStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(100%-85px)]">
      <div className="flex-1 px-4 py-6 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={idx}
              ref={messageEndRef}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-end gap-2 max-w-xs sm:max-w-md">
                {!isUser && (
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 shrink-0">
                    <img
                      src="/bot.jpg"
                      alt="Bot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`rounded-tr-md rounded-tl-[40] rounded-br-xl rounded-bl-sm p-3 text-sm break-words max-w-lg overflow-hidden ${
                    isUser
                      ? "bg-rose-500 text-white"
                      : isLight
                      ? "bg-[#edecec]"
                      : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  <ReactMarkdown
                    children={msg.content}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({
                        inline,
                        className,
                        children,
                        ...props
                      }: {
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                        [key: string]: any;
                      }) {
                        return !inline ? (
                          <pre className="bg-zinc-900 text-white p-3 rounded-lg overflow-auto text-sm">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code
                            className={`bg-zinc-800 px-1 py-0.5 rounded ${className}`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 shrink-0">
                    <img
                      src={authUser?.profilePic || "https://picsum.photos/200"}
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
  );
};

export default ChatContainer;
