export default function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 h-full w-full text-zinc-500 dark:text-zinc-400">
      <div className="bg-zinc-100 overflow-hidden dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-4">
        <img src="/bot.jpg" className="w-30 h-30" alt="bot" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-200">
        No conversations yet
      </h2>
      <p className="text-sm mt-1 max-w-md">
        You can ask me questions or switch to Live Vision and I'll tell you what's in front of your camera.
      </p>
    </div>
  );
}
