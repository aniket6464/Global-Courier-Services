import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminBranchPerformanceReport from '../pages/admin/AdminBranchPerformanceReport';
import ParcelStatusReport from '../pages/admin/ParcelStatusReport';
import ComparisonTools from '../pages/ComparisonTools';

const PerformanceReport = () => {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="branch-performance" element={<AdminBranchPerformanceReport />} />
        <Route path="parcel-status" element={<ParcelStatusReport />} />
        <Route path="comparison-tools" element={<ComparisonTools />} />
      </Routes>
    </div>
  );
};

export default PerformanceReport;
