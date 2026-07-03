import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Provider } from 'react-redux';
import store from './redux/store';

// Pages
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Projects from './pages/projects';
import Sessions from './pages/sessions';
import Profile from './pages/profile';
import Jobs from './pages/jobs';
import Register from './pages/register';
import Referral from './pages/referral';

// Layout Shell
import Shell from './components/Shell';

// Route Guard for logged-in users
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Shell>{children}</Shell>;
};

// Route Guard for guest users (login page)
const PublicRoute = ({ children }) => {
  const { user } = useApp();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referral"
        element={
          <ProtectedRoute>
            <Referral />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      {/* Redirect wildcards to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-dark-bg text-gray-100 selection:bg-brand-primary selection:text-black">
            <AppContent />
          </div>
        </BrowserRouter>
      </AppProvider>
    </Provider>
  );
}

export default App;
