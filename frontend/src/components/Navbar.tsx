import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Circle, Image } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { useThemeStore } from "@/store/useThemeStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const { isLight, toggleTheme } = useThemeStore();

  return (
    <header className={`${isLight ? "bg-[whitesmoke] text-zinc-900" : "bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white"} px-6 py-4 shadow-md`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
          NOTABOT
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-3 text-sm font-medium">

          <Link className="flex items-center gap-1 sm:border-1 border-white/30 sm:p-2 rounded-sm hover:scale-[1.02] transition" to="/analyze-image"><Image className="size-5" /><span className="hidden sm:inline">Scan Image </span></Link>
          
          {/* Theme Toggle */}
          <div onClick={toggleTheme} className={`cursor-pointer relative flex justify-between border-2 ${isLight ? "border-black" : "border-white/70"} rounded-full w-14`}>
            <Moon />
            <Sun />
            <Circle className={`absolute ${isLight ? "bg-white" : "bg-black"} rounded-full transition-all duration-300 ${isLight ? "left-0" : "left-7"}`} />
          </div>

          {authUser && <Button
            variant={isLight ? "outline" : "default"}
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
