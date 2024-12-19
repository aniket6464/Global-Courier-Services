import React from 'react';
import { FaHome, FaTruck, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import SidebarSection from './SidebarSection';  

const DeliveryPersonnelSidebar = () => {
  return (
    <nav className="p-6 space-y-6 bg-gray-900 text-gray-300 w-64 h-full">
      {/* Delivery Personnel Title */}
      <div className="text-white text-xl font-bold mb-6">Delivery Personnel</div>

      {/* Dashboard */}
      <SidebarSection icon={<FaHome />} label="Dashboard" link="/delivery-personnel/dashboard" />

      {/* Assigned Deliveries */}
      <SidebarSection icon={<FaTruck />} label="Assigned Deliveries" link="/delivery-personnel/assigned-deliveries" />

      {/* Completed Deliveries */}
      <SidebarSection icon={<FaCheckCircle />} label="Completed Deliveries" link="/delivery-personnel/completed-deliveries" />

      {/* Customer Issues */}
      <SidebarSection icon={<FaExclamationTriangle />} label="Customer Issues" link="/delivery-personnel/complaints" />
    </nav>
  );
};

export default DeliveryPersonnelSidebar;
