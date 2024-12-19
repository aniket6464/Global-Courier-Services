import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header'; 
import Sidebar from '../components/sidebar/AdminSidebar';
import Footer from '../components/Footer';

// Importing main sections
import Dashboard from '../pages/admin/Dashboard';
import BranchManagement from '../routes/BranchManagement';
import StaffManagement from '../routes/StaffManagement';
import ParcelManagement from '../routes/ParcelManagement';
import PerformanceReport from '../routes/PerformanceReport';
import Feedback from '../pages/admin/Feedback';
import Review from '../pages/admin/Review';
import Complaints from '../pages/Complaints';
import Profile from '../pages/admin/Profile'
import Settings from '../pages/admin/SystemSettings'

const AdminHome = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content - Split into Sidebar and Right-side Container */}
      <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Right-side content */}
          <div className="flex-1">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Branch Management with nested routes */}
            <Route path="branch-management/*" element={<BranchManagement />} />
            
            {/* Staff Management with nested routes */}
            <Route path="staff-management/*" element={<StaffManagement />} />
            
            {/* Parcel Management with nested routes */}
            <Route path="parcel-management/*" element={<ParcelManagement isLocalManager={false} />} />
            
            {/* Performance Management with nested routes */}
            <Route path="performance-Report/*" element={<PerformanceReport />} />
            
            <Route path="feedback" element={<Feedback />} />
            <Route path="review" element={<Review />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminHome;