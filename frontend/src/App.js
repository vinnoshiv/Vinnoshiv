import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import AutomationTools from './pages/AutomationTools';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('vinnoshiv_admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/automation" element={<AutomationTools />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
