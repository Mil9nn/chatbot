const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="h-full p-4 bg-zinc-950">
      {skeletonMessages.map((_, idx) => {
        const isSender = idx % 2 !== 0;

        return (
          <div
            key={idx}
            className={`flex items-start gap-3 ${isSender ? "justify-start flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />

            <div className="flex flex-col gap-1 items-start">
              {/* Header (name) */}
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
              {/* Message bubble */}
              <div className="h-16 w-[200px] bg-zinc-800 rounded-lg animate-pulse" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageSkeleton;
