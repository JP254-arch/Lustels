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
import HostelForm from "./Forms/hostelform"; // Add or Update Hostel
import WardenForm from "./Forms/Wardenform"; // Add or Update Warden
import ResidentForm from "./Forms/residentform"; // Add or Update Resident

// Management Pages
import WardenManagement from "./manage/warden";
import HostelManagement from "./manage/hostel";
import ClientManagement from "./manage/residents";

// Layout
import Layout from "./layout/layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap pages with Layout for consistent Navbar & Footer */}
        <Route element={<Layout />}>
          {/* Public Pages */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/hostels/:id" element={<HostelDetails />} />

          {/* Dashboards */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/warden" element={<WardenDashboard />} />
          <Route path="/client" element={<ClientDashboard />} />

          {/* Forms */}
          <Route path="/hostel-form" element={<HostelForm />} />
          <Route path="/warden-form" element={<WardenForm />} />
          <Route path="/resident-form" element={<ResidentForm />} />

          {/* Management Pages */}
          <Route path="/manage-hostels" element={<HostelManagement />} />
          <Route path="/manage-wardens" element={<WardenManagement />} />
          <Route path="/manage-clients" element={<ClientManagement />} />
        </Route>

        {/* Fallback */}
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
