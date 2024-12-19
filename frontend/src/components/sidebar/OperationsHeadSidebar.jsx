import React from 'react';
import { FaHome, FaChartBar, FaBalanceScale, FaLightbulb, FaArrowCircleUp, FaTruck, FaBoxes, FaSmile } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  
import SidebarLink from './SidebarLink';       

const OperationsHeadSidebar = () => {
    return (
      <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
        {/* Operations Head Title */}
        <div className="text-white text-xl font-bold mb-6">Operations Head</div>

        {/* Dashboard */}
        <SidebarSection icon={<FaHome />} label="Dashboard" link="/operations-head/dashboard" />

        {/* Branch Performance Report */}
        <SidebarSection icon={<FaChartBar />} label="Branch Performance Report">
          <SidebarLink label="Main Branch Performance" to="/operations-head/branch-performance-report/main-branch" />
          <SidebarLink label="Regional Hub Performance" to="/operations-head/branch-performance-report/regional-hub" />
          <SidebarLink label="Local Office Performance" to="/operations-head/branch-performance-report/local-office" />
        </SidebarSection>

        {/* Comparison Tools */}
        <SidebarSection icon={<FaBalanceScale />} label="Comparison Tools">
          <SidebarLink label="Main Branch Comparisons" to="/operations-head/comparison-tools/main-branch" />
          <SidebarLink label="Regional Hub Comparisons" to="/operations-head/comparison-tools/regional-hub" />
          <SidebarLink label="Local Office Comparisons" to="/operations-head/comparison-tools/local-office" />
        </SidebarSection>

        {/* Strategic Insights */}
        <SidebarSection icon={<FaLightbulb />} label="Strategic Insights">
          <SidebarLink label="Parcel Transfer Efficiency" icon={<FaArrowCircleUp />} to="/operations-head/strategic-insights/parcel-transfer-efficiency" />
          <SidebarLink label="Parcel Delivery Efficiency" icon={<FaTruck />} to="/operations-head/strategic-insights/parcel-delivery-efficiency" />
          <SidebarLink label="Parcel Condition Analysis" icon={<FaBoxes />} to="/operations-head/strategic-insights/parcel-condition-analysis" />
          <SidebarLink label="Customer Satisfaction" icon={<FaSmile />} to="/operations-head/strategic-insights/customer-satisfaction" />
        </SidebarSection>
      </nav>
    );
};

export default OperationsHeadSidebar;
