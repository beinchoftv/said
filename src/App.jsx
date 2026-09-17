import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './contexts/AppContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import SupplierDashboard from './pages/SupplierDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PublicCatalog from './pages/PublicCatalog.jsx';
import InvoicePage from './pages/InvoicePage.jsx';

function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/catalog/:supplierId" element={<PublicCatalog />} />
      <Route path="/invoice/:supplierId/:orderId" element={<InvoicePage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute role="supplier"><SupplierDashboard /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
