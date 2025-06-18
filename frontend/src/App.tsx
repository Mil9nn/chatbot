import { Navigate, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import MainLayout from "./layout/MainLayout"
import Profile from "./pages/Profile"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"
import { Loader } from "lucide-react"
import { useThemeStore } from "./store/useThemeStore"
import AnalyzeImage from "./pages/AnalyzeImage"

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const authUser = useAuthStore((state) => state.authUser);

  const { isCheckingAuth } = useAuthStore();

  const { isLight } = useThemeStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) {
    return <div className={`{isLight ? "bg-white text-black" : "bg-zinc-950 text-white"} flex gap-1 items-center justify-center w-screen h-screen`}>
      <span>Loading your account</span>
      <Loader className="animate-spin" />
    </div>
  }

  return (
    <div className={`${isLight ? "" : "bg-zinc-950 text-white"}`}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={!authUser ? <Navigate to="/login" /> : <Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analyze-image" element={<AnalyzeImage />} />
        </Route>
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

export default App

