import { useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarSection = ({ icon, label, children, link }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen); // Toggle the section
  };

  const renderLabel = () => {
    // If a link is provided, render a Link for internal routing
    if (link) {
      return (
        <Link to={link} className="flex items-center">
          <span className="text-gray-400">{icon}</span>
          <span className="ml-2 text-white">{label}</span>
        </Link>
      );
    }

    // Default rendering without a link
    return (
      <div className="flex items-center">
        <span className="text-gray-400">{icon}</span>
        <span className="ml-2 text-white">{label}</span>
      </div>
    );
  };

  return (
    <div className="mb-4">
      {/* Main Section */}
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-gray-700 p-3 rounded-md"
        onClick={toggleSection}
      >
        {renderLabel()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-auto h-4 w-4 text-gray-300 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Subsections */}
      {isOpen && (
        <div className="ml-6 mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
