import React, { useState } from "react";
import BranchPerformance from "../BranchPerformance";
import LocalOfficePerformance from "../LocalOfficePerformance";

const AdminBranchPerformanceReport = () => {
  const [branchType, setBranchType] = useState("main"); // Default to main branch

  const renderPerformanceComponent = () => {
    switch (branchType) {
      case "main":
        return <BranchPerformance branchType="main" />;
      case "regional":
        return <BranchPerformance branchType="regional" />;
      case "local":
        return <LocalOfficePerformance />;
      default:
        return null;
    }
  };

  return (
    <div className="performance-report-container">
      <div className="branch-selection">
        <label htmlFor="branchType" className="px-4">Select Branch Type:</label>
        <select
          id="branchType"
          value={branchType}
          onChange={(e) => setBranchType(e.target.value)}
          className="branch-select"
        >
          <option value="main">Main Branch</option>
          <option value="regional">Regional Hub</option>
          <option value="local">Local Office</option>
        </select>
      </div>
      <div className="performance-report">
        {renderPerformanceComponent()}
      </div>
    </div>
  );
};

export default AdminBranchPerformanceReport;
