import React from 'react';
import { Link } from 'react-router-dom';

const SidebarLink = ({ label, icon, to }) => {
    return (
      <Link
        to={to} // Use 'to' prop for link navigation
        className="flex items-center text-sm text-gray-400 hover:text-white p-1 transition-colors"
      >
        {icon && <span className="mr-2">{icon}</span>} {/* Render icon if provided */}
        {label}
      </Link>
    );
};

export default SidebarLink;
