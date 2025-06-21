import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Circle, RefreshCcw } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { useThemeStore } from "@/store/useThemeStore";
import { useMessageStore } from "@/store/useMessageStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const { isLight, toggleTheme } = useThemeStore();

  const { deleteAllMessages, setInputMessage, messages } = useMessageStore();

  const handleChatReset = () => {
    if (!authUser?._id) return;
    deleteAllMessages(authUser._id);
    setInputMessage("");
  };

  return (
    <header
      className={`${
        isLight
          ? "bg-[whitesmoke] text-zinc-900"
          : "bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white"
      } min-h-[70px] px-6 py-4 shadow-md`}
    >
      <div className="max-w-7xl mx-auto flex sm:items-center justify-between gap-3 sm:flex-row flex-col">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-1 text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors"
          >
            <img src="/bot.jpg" alt="logo" className="w-8 h-8 rounded-full" />
            NOTABOT
          </Link>
          {messages.length > 0 && (
            <Button
              variant={isLight ? "outline" : "default"}
              title="Reset chat history"
              className="cursor-pointer rounded-none"
              onClick={handleChatReset}
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Chat
            </Button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex items-center self-end gap-5 text-sm font-medium">
          {/* Theme Toggle */}
          <div
            onClick={toggleTheme}
            className={`cursor-pointer relative flex justify-between border-2 ${
              isLight ? "border-black" : "border-white/70"
            } rounded-full w-14`}
          >
            <Moon />
            <Sun />
            <Circle
              className={`absolute ${
                isLight ? "bg-white" : "bg-black"
              } rounded-full transition-all duration-300 ${
                isLight ? "left-0" : "left-7"
              }`}
            />
          </div>

          <Link className="flex items-center gap-1" to="/analyze-image">
            <img src="/svgs/stars.svg" alt="analysis-icon" />
            <span className="inline">Live Vision</span>
          </Link>

          {authUser && (
            <Button
              title="Logout"
              variant={isLight ? "outline" : "default"}
              onClick={() => {
                logout(navigate);
              }}
              className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 transition-colors"
            >
              <LogOut className="size-5 font-extrabold " />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
