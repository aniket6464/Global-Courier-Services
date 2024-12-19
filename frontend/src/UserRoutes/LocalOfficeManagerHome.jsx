import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/sidebar/LocalOfficeManagerSidebar';
import Footer from '../components/Footer';

// Importing main sections
import Dashboard from '../pages/localOfficeManager/Dashboard';
import ParcelManagement from '../routes/ParcelManagement';
import BranchPerformanceReport from '../pages/localOfficeManager/BranchPerformanceReport';
import CreateNewStaff from '../pages/CreateNewStaff';
import ListStaff from '../pages/ListStaff';
import Feedback from '../pages/admin/Feedback';
import Complaints from '../pages/Complaints';
import Profile from '../pages/localOfficeManager/Profile';

const LocalOfficeManagerHome = () => {
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
            
            {/* Staff Management */}
            <Route path="staff-management/*" >
              {/* Create New Staff Route */}
              <Route path="create-new" element={<CreateNewStaff />} />

              {/* Routes to list different staff roles */}
              <Route path="list-delivery-personnel" element={<ListStaff staffType="delivery-personnel" />} />
            </Route>
            
            {/* Parcel Management */}
            <Route path="parcel-management/*" element={<ParcelManagement isLocalManager={true} />} />
            
            {/* Branch Performance Report */}
            <Route path="branch-performance-report" element={<BranchPerformanceReport />} />
            
            {/* Feedback */}
            <Route path="feedback" element={<Feedback />} />
            
            {/* Complaints */}
            <Route path="complaints" element={<Complaints />} />

            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LocalOfficeManagerHome;
