import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/sidebar/OperationsHeadSidebar';
import Footer from '../components/Footer';

// Importing main sections
import Dashboard from '../pages/operationsHead/Dashboard';
import BranchPerformanceReport from '../routes/BranchPerformanceReport';
import ComparisonToolsRoute from '../routes/ComparisonToolsRoute';
import StrategicInsights from '../routes/StrategicInsights';
import Profile from '../pages/operationsHead/Profile'

const OperationsHeadHome = () => {
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
            
            {/* Branch Performance Report */}
            <Route path="branch-performance-report/*" element={<BranchPerformanceReport />} />
            
            {/* Comparison Tools */}
            <Route path="comparison-tools/*" element={<ComparisonToolsRoute />} />
            
            {/* Strategic Insights */}
            <Route path="strategic-insights/*" element={<StrategicInsights />} />

            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OperationsHeadHome;
