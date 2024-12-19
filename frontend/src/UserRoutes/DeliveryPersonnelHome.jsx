import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/sidebar/DeliveryPersonnelSidebar';
import Footer from '../components/Footer';

// Importing main sections
import Dashboard from '../pages/deliveryPersonnel/Dashboard';
import AssignedDeliveries from '../pages/DeliveryPersonnel/AssignedDeliveries';
import CustomerIssues from '../pages/Complaints';
import Profile from '../pages/DeliveryPersonnel/Profile';

const DeliveryPersonnelHome = () => {
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
            
            {/* Assigned Deliveries */}
            <Route path="assigned-deliveries" element={<AssignedDeliveries completed={false} />} />
            
            {/* Completed Deliveries */}
            <Route path="completed-deliveries" element={<AssignedDeliveries completed={true} />} />
            
            {/* Customer Issues */}
            <Route path="complaints" element={<CustomerIssues />} />

            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DeliveryPersonnelHome;
