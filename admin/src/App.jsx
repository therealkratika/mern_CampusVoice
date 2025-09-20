import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  
    </>
  );
}

export default App;

