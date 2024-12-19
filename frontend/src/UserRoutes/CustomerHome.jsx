import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/sidebar/CustomerSidebar';
import Footer from '../components/Footer';

// Importing main sections
import Dashboard from '../pages/customer/Dashboard';
import CustomerParcelManagement from '../routes/CustomerParcelManagement';
import Complaints from '../pages/customer/Complaints';
import Feedback from '../pages/customer/Feedback';
import Review from '../pages/customer/Review';
import Profile from '../pages/customer/Profile';

const CustomerHome = () => {
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
            
            {/* Parcel Management */}
            <Route path="parcel-management/*" element={<CustomerParcelManagement />} />
            
            {/* Complaints */}
            <Route path="complaints" element={<Complaints />} />
            
            {/* Feedback & Reviews */}
            <Route path="feedback" element={<Feedback />} />
            <Route path="review" element={<Review />} />

            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerHome;
