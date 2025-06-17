import { Link, useNavigate } from "react-router-dom";
import { User, LogIn, UserPlus, LogOut, Moon, Sun, SunDim, Circle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { useThemeStore } from "@/store/useThemeStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const { isLight, toggleTheme } = useThemeStore();

  return (
    <header className={`${isLight ? "bg-[whitesmoke] text-zinc-900" : "bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white"} px-6 py-4 shadow-md`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
          ChatBot
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* Theme Toggle */}
          <div onClick={toggleTheme} className={`cursor-pointer relative flex justify-between border-2 ${isLight ? "border-black/70" : "border-white/70"} rounded-full w-14`}>
            <Moon />
            <Sun />
            <Circle className={`absolute ${isLight ? "bg-white" : "bg-black"} rounded-full transition-all duration-300 ${isLight ? "left-0" : "left-7"}`} />
          </div>

          {authUser && <Button
            variant={isLight ? "outline" : ""}
            onClick={() => {logout(navigate)}}
            className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 transition-colors"
          >
            Logout
            <LogOut className="size-4" />
          </Button>}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
