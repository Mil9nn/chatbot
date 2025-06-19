import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Circle, Image, RefreshCcw } from "lucide-react";
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
  }

  return (
    <header className={`${isLight ? "bg-[whitesmoke] text-zinc-900" : "bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white"} min-h-[70px] px-6 py-4 shadow-md`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
          NOTABOT
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-3 text-sm font-medium">

          {/* Reset Chat History */}
          {messages.length > 0 && (
            <Button variant={isLight ? "outline" : "default"} title="Reset chat history" className="cursor-pointer" onClick={handleChatReset}>
              <RefreshCcw className="w-4 h-4" />
            </Button>
          )}

          <Button variant={isLight ? "outline" : "default"}>
            <Link className="flex items-center gap-1" to="/analyze-image">
              <Image className="size-5" />
              <span className="hidden sm:inline">Scan Image</span>
            </Link>
          </Button>

          {/* Theme Toggle */}
          <div onClick={toggleTheme} className={`cursor-pointer relative flex justify-between border-2 ${isLight ? "border-black" : "border-white/70"} rounded-full w-14`}>
            <Moon />
            <Sun />
            <Circle className={`absolute ${isLight ? "bg-white" : "bg-black"} rounded-full transition-all duration-300 ${isLight ? "left-0" : "left-7"}`} />
          </div>

          {authUser && <Button
            title="Logout"
            variant={isLight ? "outline" : "default"}
            onClick={() => { logout(navigate) }}
            className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 transition-colors"
          >
            <LogOut className="size-4" />
          </Button>}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
