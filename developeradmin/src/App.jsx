import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, useAdmin } from "./context/AdminContext.jsx";

import Login     from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import UsersPage from "./pages/users.jsx";
import JobsPage  from "./pages/jobs.jsx";
import ProjectsPage from "./pages/projects.jsx";
import SessionsPage from "./pages/sessions.jsx";
import SubmissionsPage from "./pages/submissions.jsx";
import RegistrationRequestsPage from "./pages/registrationRequests.jsx";

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { admin } = useAdmin();
  // if (!admin) return <Navigate to="/login" replace />;
  return children;
}

// ─── Routes ───────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { admin } = useAdmin();
  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users"     element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/registration-requests" element={<ProtectedRoute><RegistrationRequestsPage /></ProtectedRoute>} />
      <Route path="/submissions" element={<ProtectedRoute><SubmissionsPage /></ProtectedRoute>} />
      <Route path="/jobs"      element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
      <Route path="/projects"  element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/practice"  element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/sessions"  element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />


      <Route path="*" element={<Navigate to={admin ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}
