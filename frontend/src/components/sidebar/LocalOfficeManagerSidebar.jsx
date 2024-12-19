import React from 'react';
import { FaHome, FaUsers, FaBox, FaChartBar, FaExclamationCircle, FaComments } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  
import SidebarLink from './SidebarLink';       

const LocalOfficeManagerSidebar = () => {
    return (
      <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
        {/* Local Office Manager Title */}
        <div className="text-white text-xl font-bold mb-6">Local Office Manager</div>

        {/* Dashboard */}
        <SidebarSection icon={<FaHome />} label="Dashboard" link="/local-office-manager/dashboard" />

        {/* Staff Management */}
        <SidebarSection icon={<FaUsers />} label="Team Management">
          <SidebarLink label="Create New Staff" to="/local-office-manager/staff-management/create-new" />
          <SidebarLink label="Delivery Personnel" to="/local-office-manager/staff-management/list-delivery-personnel" />
        </SidebarSection>

        {/* Parcel Management */}
        <SidebarSection icon={<FaBox />} label="Parcel Operations">
          <SidebarLink label="Create New Parcel" to="/local-office-manager/parcel-management/create" />
          <SidebarLink label="Customer Request" to="/local-office-manager/parcel-management/customer-requests" />
          <SidebarLink label="List of Parcels" to="/local-office-manager/parcel-management/list" />
          <SidebarLink label="Track Parcel" to="/local-office-manager/parcel-management/track" />
        </SidebarSection>

        {/* Branch Performance Report */}
        <SidebarSection icon={<FaChartBar />} label="Branch Performance Report" link="/local-office-manager/branch-performance-report" />

        {/* Feedback */}
        <SidebarSection icon={<FaComments />} label="Feedback" link="/local-office-manager/feedback" />

        {/* Complaints */}
        <SidebarSection icon={<FaExclamationCircle />} label="Complaints" link="/local-office-manager/complaints" />
      </nav>
    );
};

export default LocalOfficeManagerSidebar;
