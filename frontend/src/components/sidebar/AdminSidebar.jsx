import React from 'react';
import { FaHome, FaBuilding, FaUsers, FaBox, FaChartBar, FaComments, FaExclamationCircle } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  
import SidebarLink from './SidebarLink';       

const Sidebar = () => {
  return (
    <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
      {/* Admin Title */}
      <div className="text-white text-xl font-bold mb-6">Admin</div>

      {/* Dashboard */}
      <SidebarSection icon={<FaHome />} label="Dashboard" link="/admin/dashboard" />

      {/* Branch Management */}
      <SidebarSection icon={<FaBuilding />} label="Branch Operations">
        <SidebarLink label="Create New Branch" to="/admin/branch-management/add-new" />
        <SidebarLink label="List of Main Branches" to="/admin/branch-management/list-main" />
        <SidebarLink label="List of Regional Hubs" to="/admin/branch-management/list-regional" />
        <SidebarLink label="List of Local Offices" to="/admin/branch-management/list-local" />
      </SidebarSection>

      {/* Staff Management */}
      <SidebarSection icon={<FaUsers />} label="Team Management">
        <SidebarLink label="Create New Staff" to="/admin/staff-management/create-new" />
        <SidebarLink label="Operations Head" to="/admin/staff-management/list-operations-head" />
        <SidebarLink label="Main Branch Manager" to="/admin/staff-management/list-main-branch-manager" />
        <SidebarLink label="Regional Hub Manager" to="/admin/staff-management/list-regional-hub-manager" />
        <SidebarLink label="Local Office Manager" to="/admin/staff-management/list-local-office-manager" />
        <SidebarLink label="Delivery Personnel" to="/admin/staff-management/list-delivery-personnel" />
      </SidebarSection>

      {/* Parcel Management */}
      <SidebarSection icon={<FaBox />} label="Parcel Operations">
        <SidebarLink label="List of Parcels" to="/admin/parcel-management/list" />
        <SidebarLink label="Track Parcel" to="/admin/parcel-management/track" />
      </SidebarSection>

      {/* Performance Report */}
      <SidebarSection icon={<FaChartBar />} label="Reports & Analytics">
        <SidebarLink label="Branch Performance Report" to="/admin/performance-Report/branch-performance" />
        <SidebarLink label="Parcel Flow and Status Report" to="/admin/performance-Report/parcel-status" />
        <SidebarLink label="Comparison Tools" to="/admin/performance-Report/comparison-tools" />
      </SidebarSection>

      {/* Feedback & Review */}
      <SidebarSection icon={<FaComments />} label="Customer Feedback" >
        <SidebarLink label="Feedback" to="/admin/feedback" />
        <SidebarLink label="Reviews" to="/admin/review" />
      </SidebarSection>

      {/* Complaints */}
      <SidebarSection icon={<FaExclamationCircle />} label="Support & Complaints" link="/admin/complaints" />
    </nav>
  );
};

export default Sidebar;
