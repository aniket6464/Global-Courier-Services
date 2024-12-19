import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ComparisonPage from '../pages/ComparisonTools';

const ComparisonToolsRoute = () => {
  return (
    <Routes>      
      {/* Route for Main Branch comparison */}
      <Route path="main-branch" element={<ComparisonPage branchTypeProp="Main Branch" />} />
      
      {/* Route for Regional Hub comparison */}
      <Route path="regional-hub" element={<ComparisonPage branchTypeProp="Regional Hub" />} />
      
      {/* Route for Local Office comparison */}
      <Route path="local-office" element={<ComparisonPage branchTypeProp="Local Office" />} />
      
    </Routes>
  );
};

export default ComparisonToolsRoute;
