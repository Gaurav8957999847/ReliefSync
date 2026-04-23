import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Volunteers from './pages/Volunteers';
import Needs from './pages/Needs';
import Assignments from './pages/Assignments';
import Matching from './pages/Matching';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f1f5f9',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '14px',
              fontWeight: '600',
              padding: '14px 20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            },
            success: {
              iconTheme: { primary: '#14b8a6', secondary: '#0f172a' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#0f172a' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/needs" element={<Needs />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
