import React from 'react';
import { FaHome, FaBox, FaHistory, FaExclamationCircle, FaComments } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  
import SidebarLink from './SidebarLink';       

const CustomerSidebar = () => {
    return (
      <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
        {/* Customer Title */}
        <div className="text-white text-xl font-bold mb-6">Customer</div>

        {/* Dashboard */}
        <SidebarSection icon={<FaHome />} label="Dashboard" link="/customer/dashboard" />

        {/* Parcel Management */}
        <SidebarSection icon={<FaBox />} label="Parcel Management">
          <SidebarLink label="New Parcel Request" to="/customer/parcel-management/new-request" />
          <SidebarLink label="My Requests" to="/customer/parcel-management/my-requests" />
          <SidebarLink label="Active Parcels" to="/customer/parcel-management/active-parcels" />
          <SidebarLink label="Track Parcel" to="/customer/parcel-management/track-parcel" />
        </SidebarSection>

        {/* Parcel History */}
        <SidebarSection icon={<FaHistory />} label="Parcel History" link="/customer/parcel-management/parcel-history" />

        {/* Complaints */}
        <SidebarSection icon={<FaExclamationCircle />} label="Complaints" link="/customer/complaints" />

        {/* Feedback & Reviews */}
        <SidebarSection icon={<FaComments />} label="Feedback & Reviews" >
        <SidebarLink label="Feedback" to="/customer/feedback" />
        <SidebarLink label="Reviews" to="/customer/review" />
        </SidebarSection>
      </nav>
    );
};

export default CustomerSidebar;
