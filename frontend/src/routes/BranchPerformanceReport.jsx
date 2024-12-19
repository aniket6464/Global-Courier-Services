import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components for each section
import BranchPerformance from '../pages/BranchPerformance'; // For main branch and regional hub
import LocalOfficePerformance from '../pages/LocalOfficePerformance'; // For local office

const BranchPerformanceReport = () => {
  const mainBranchData = [
    // Add your data for main branch performance
  ];
  const regionalHubData = [
    // Add your data for regional hub performance
  ];
  const localOfficeData = [
    // Add your data for local office performance
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6">
        <Routes>
          {/* Main Branch Performance Route */}
          <Route path="main-branch" element={<BranchPerformance branchType="main" branchData={mainBranchData} />} />

          {/* Regional Hub Performance Route */}
          <Route path="regional-hub" element={<BranchPerformance branchType="regional" branchData={regionalHubData} />} />

          {/* Local Office Performance Route */}
          <Route path="local-office" element={<LocalOfficePerformance officeData={localOfficeData} />} />
        </Routes>
      </div>
    </div>
  );
};

export default BranchPerformanceReport;
