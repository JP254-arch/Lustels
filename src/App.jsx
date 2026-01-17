import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Homepage from "./pages/homepage";
import About from "./pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Register from "./pages/register";
import Hostels from "./pages/hostels";
import HostelDetails from "./pages/hostelDetails";

// Dashboards
import AdminDashboard from "./dashboards/admin";
import WardenDashboard from "./dashboards/warden";
import ClientDashboard from "./dashboards/client";

// Forms
import HostelForm from "./Forms/hostelform";
import WardenForm from "./Forms/Wardenform";
import ResidentForm from "./Forms/residentform";

// Management Pages
import WardenManagement from "./manage/warden";
import HostelManagement from "./manage/hostel";
import ClientManagement from "./manage/residents";

// Layout
import Layout from "./layout/layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/hostels/:id" element={<HostelDetails />} />

          {/* Auth pages (blocked when logged in) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-hostels" element={<HostelManagement />} />
            <Route path="/manage-wardens" element={<WardenManagement />} />
            <Route path="/manage-clients" element={<ClientManagement />} />
            <Route path="/warden-form" element={<WardenForm />} />
            <Route path="/hostel-form" element={<HostelForm />} />
          </Route>

          {/* WARDEN */}
          <Route element={<ProtectedRoute allowedRoles={["warden"]} />}>
            <Route path="/warden" element={<WardenDashboard />} />
          </Route>

          {/* RESIDENT */}
          <Route element={<ProtectedRoute allowedRoles={["resident"]} />}>
            <Route path="/resident" element={<ClientDashboard />} />
            <Route path="/resident-form" element={<ResidentForm />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>404 – Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
