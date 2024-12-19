import React from 'react';
import { FaHome, FaUsers, FaBox, FaChartBar, FaExclamationCircle, FaComments, FaWarehouse } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  
import SidebarLink from './SidebarLink';       

const RegionalHubManagerSidebar = () => {
    return (
      <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
        {/* Regional Hub Manager Title */}
        <div className="text-white text-xl font-bold mb-6">Regional Hub Manager</div>

        {/* Dashboard */}
        <SidebarSection icon={<FaHome />} label="Dashboard" link="/regional-hub-manager/dashboard" />

        {/* Staff Management */}
        <SidebarSection icon={<FaUsers />} label="Team Management">
          <SidebarLink label="Create New Staff" to="/regional-hub-manager/staff-management/create-new" />
          <SidebarLink label="Local Office Managers" to="/regional-hub-manager/staff-management/list-local-office-manager" />
          <SidebarLink label="Delivery Personnel" to="/regional-hub-manager/staff-management/list-delivery-personnel" />
        </SidebarSection>

        {/* Parcel Management */}
        <SidebarSection icon={<FaBox />} label="Parcel Operations">
          <SidebarLink label="Create New Parcel" to="/regional-hub-manager/parcel-management/create" />
          <SidebarLink label="List of Parcels" to="/regional-hub-manager/parcel-management/list" />
          <SidebarLink label="Track Parcel" to="/regional-hub-manager/parcel-management/track" />
        </SidebarSection>

        {/* Branch Performance Report */}
        <SidebarSection icon={<FaChartBar />} label="Branch Performance Report">
          <SidebarLink label="Regional Hub" icon={<FaWarehouse />} to="/regional-hub-manager/performance-report/regional-hub" />
          <SidebarLink label="Local Office" icon={<FaWarehouse />} to="/regional-hub-manager/performance-report/local-office-report" />
        </SidebarSection>

        {/* Feedback */}
        <SidebarSection icon={<FaComments />} label="Feedback" link="/regional-hub-manager/feedback" />

        {/* Complaints */}
        <SidebarSection icon={<FaExclamationCircle />} label="Complaints" link="/regional-hub-manager/complaints" />
      </nav>
    );
};

export default RegionalHubManagerSidebar;
