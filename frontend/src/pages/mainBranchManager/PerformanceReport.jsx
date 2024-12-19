import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainBranchReport from './MainBranchReport';
import BranchPerformance from '../BranchPerformance';
import LocalOfficePerformance from '../LocalOfficePerformance';

function PerformanceReport() {
  return (
    <div>
      <Routes>
        {/* Routes for viewing reports */}
        <Route path="main-branch-report" element={<MainBranchReport />} />
        <Route path="regional-hub-report" element={<BranchPerformance branchType="regional" />} />
        <Route path="local-office-report" element={<LocalOfficePerformance />} />
      </Routes>
    </div>
  );
}

export default PerformanceReport;
