import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import AdminOverview from './admin/Overview.jsx';
import SuppliersPage from './admin/SuppliersPage.jsx';
import DomainsPage from './admin/DomainsPage.jsx';
import AnnouncementsPage from './admin/AnnouncementsPage.jsx';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="domains" element={<DomainsPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
