import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Circle, RefreshCcw, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { useThemeStore } from "@/store/useThemeStore";
import { useMessageStore } from "@/store/useMessageStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const { isLight, toggleTheme } = useThemeStore();
  const { deleteAllMessages, setInputMessage, messages } = useMessageStore();

  const [menuOpen, setMenuOpen] = useState(false);

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
      } sticky top-0 z-[1000] px-6 py-4 shadow-md w-full`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Reset */}
        <div className="flex items-center gap-3">
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
              className="hidden sm:flex gap-1 items-center"
              onClick={handleChatReset}
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Chat
            </Button>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="sm:hidden block"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium">
          {/* Theme Toggle */}
          <div
  onClick={toggleTheme}
  className={`cursor-pointer relative flex items-center justify-between w-16 h-7.5 px-1 border-2 rounded-full transition-colors duration-300 
    ${isLight ? "border-black bg-white" : "border-white/30 bg-zinc-800 hover:bg-zinc-700"}
  `}
>
  <Moon className="w-5 h-5" />
  <Sun className="w-5 h-5 text-orange-300" />
  <Circle
    className={`absolute top-0.4 h-7 w-7 rounded-full shadow-md transition-all duration-300 ${
      isLight ? "left-0 bg-white" : "left-8 bg-black"
    }`}
  />
</div>


          <Link className="flex items-center gap-1" to="/analyze-image">
            <img src="/svgs/stars.svg" alt="analysis-icon" />
            <span>Live Vision</span>
          </Link>

          {authUser && (
            <Button
              title="Logout"
              variant={isLight ? "outline" : "default"}
              onClick={() => logout(navigate)}
              className="flex items-center gap-1"
            >
              <LogOut className="size-5" />
              <span>Logout</span>
            </Button>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-4 text-sm font-medium">
          <Button
            variant={isLight ? "outline" : "default"}
            onClick={toggleTheme}
            className="flex items-center justify-between"
          >
            <Moon /> <Sun />
          </Button>

          <Link to="/analyze-image" onClick={() => setMenuOpen(false)}>
            <div className="flex items-center gap-1">
              <img src="/svgs/stars.svg" alt="analysis-icon" />
              Live Vision
            </div>
          </Link>

          {authUser && (
            <Button
              title="Logout"
              variant={isLight ? "outline" : "default"}
              onClick={() => {
                logout(navigate);
                setMenuOpen(false);
              }}
              className="flex items-center gap-1"
            >
              <LogOut className="size-5" />
              Logout
            </Button>
          )}

          {messages.length > 0 && (
            <Button
              onClick={handleChatReset}
              variant={isLight ? "outline" : "default"}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Chat
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
