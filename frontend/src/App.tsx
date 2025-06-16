import { Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App

