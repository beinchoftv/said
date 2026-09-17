import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import SupplierOverview from './supplier/Overview.jsx';
import ProductsPage from './supplier/ProductsPage.jsx';
import OrdersPage from './supplier/OrdersPage.jsx';
import InvoicesPage from './supplier/InvoicesPage.jsx';
import DomainPage from './supplier/DomainPage.jsx';
import SettingsPage from './supplier/SettingsPage.jsx';

export default function SupplierDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<SupplierOverview />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="domain" element={<DomainPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
