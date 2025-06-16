import { Link, useNavigate } from "react-router-dom";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./button";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
          ChatBot
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/profile"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <User className="size-4" />
            Profile
          </Link>
          {!authUser && <Link
            to="/signup"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <UserPlus className="size-4" />
            Signup
          </Link>}
          {!authUser && <Link
            to="/login"
            className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
          >
            <LogIn className="size-4" />
            Login
          </Link>}
          {authUser && <Button
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
