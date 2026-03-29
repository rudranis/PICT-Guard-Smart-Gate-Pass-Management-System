import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Pages
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import UserPortal from "./pages/UserPortal";
import GuardLogin from "./pages/GuardLogin";
import GuardScanner from "./pages/GuardScanner";
import VisitorRegistration from "./pages/VisitorRegistration";
import AlumniRegistration from "./pages/AlumniRegistration";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/portal" element={<UserPortal />} />
          <Route path="/guard/login" element={<GuardLogin />} />
          <Route path="/guard/scanner" element={<GuardScanner />} />
          <Route path="/visitor/register" element={<VisitorRegistration />} />
          <Route path="/alumni/register" element={<AlumniRegistration />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;