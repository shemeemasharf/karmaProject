import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ItemPage from './components/ItemPage';
import ReportsPage from './components/ReportsPage';
import AddItemPage from './components/AddItemPage'; // Add this import
import Layout from './components/layout/Layout';
import './styles/global.css';

const PrivateRoutes: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Layout onLogout={logout}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items" element={<ItemPage />} />
        <Route path="/items/add" element={<AddItemPage />} /> {/* Add this route */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <Router>
      <PrivateRoutes />
    </Router>
  );
};

const AppWrapper: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;