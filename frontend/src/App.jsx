import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // optional, for after login
import AdminDashboard from "./pages/AdminDashboard";
import AIChat from "./components/AIChat";
import ProfessorProfile from "./pages/ProfessorProfile";
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:collegeId" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/professors/:id" element={<ProfessorProfile />} />

      </Routes>
    </BrowserRouter>
    <div>
      <AIChat />
    </div>
    </>
  );
}

export default App;

