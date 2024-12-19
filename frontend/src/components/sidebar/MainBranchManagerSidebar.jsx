import React from 'react';
import { FaHome, FaUsers, FaBox, FaChartBar, FaExclamationCircle, FaComments, FaWarehouse, FaTruck } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  
import SidebarLink from './SidebarLink';       

const MainBranchManagerSidebar = () => {
    return (
      <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
        {/* Main Branch Manager Title */}
        <div className="text-white text-xl font-bold mb-6">Main Branch Manager</div>

        {/* Dashboard */}
        <SidebarSection icon={<FaHome />} label="Dashboard" link="/main-branch-manager/dashboard" />

        {/* Staff Management */}
        <SidebarSection icon={<FaUsers />} label="Team Management">
          <SidebarLink label="Create New Staff" to="/main-branch-manager/staff-management/create-new" />
          <SidebarLink label="Regional Hub Managers" to="/main-branch-manager/staff-management/list-regional-hub-manager" />
          <SidebarLink label="Local Office Managers" to="/main-branch-manager/staff-management/list-local-office-manager" />
          <SidebarLink label="Delivery Personnel" to="/main-branch-manager/staff-management/list-delivery-personnel" />
        </SidebarSection>

        {/* Parcel Management */}
        <SidebarSection icon={<FaBox />} label="Parcel Operations">
          <SidebarLink label="Create New Parcel" to="/main-branch-manager/parcel-management/create" />
          <SidebarLink label="List of Parcels" to="/main-branch-manager/parcel-management/list" />
          <SidebarLink label="Track Parcel" to="/main-branch-manager/parcel-management/track" />
        </SidebarSection>

        {/* Branch Performance Report */}
        <SidebarSection icon={<FaChartBar />} label="Branch Performance Report">
          <SidebarLink label="Main Branch" icon={<FaWarehouse />} to="/main-branch-manager/performance-report/main-branch-report" />
          <SidebarLink label="Regional Hub" icon={<FaWarehouse />} to="/main-branch-manager/performance-report/regional-hub-report" />
          <SidebarLink label="Local Office" icon={<FaWarehouse />} to="/main-branch-manager/performance-report/local-office-report" />
        </SidebarSection>

        {/* Feedback */}
        <SidebarSection icon={<FaComments />} label="Feedback " link="/main-branch-manager/feedback" />

        {/* Complaints */}
        <SidebarSection icon={<FaExclamationCircle />} label="Complaints" link="/main-branch-manager/complaints" />
      </nav>
    );
};

export default MainBranchManagerSidebar;
