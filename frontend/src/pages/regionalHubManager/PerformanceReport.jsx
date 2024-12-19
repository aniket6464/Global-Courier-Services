import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegionalHubReport from './RegionalHubReport';
import LocalOfficePerformance from '../LocalOfficePerformance';

function PerformanceReport() {
  return (
    <div>
      <Routes>
        {/* Route for Regional Hub Report */}
        <Route path="regional-hub" element={<RegionalHubReport />} />
        
        {/* Route for Local Office Report */}
        <Route path="local-office-report" element={<LocalOfficePerformance />} />
      </Routes>
    </div>
  );
}

export default PerformanceReport;
