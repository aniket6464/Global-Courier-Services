import React from 'react';

const QuickLinks = () => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-100">Dashboard</a></li>
              <li><a href="#" className="hover:text-gray-100">Branch Management</a></li>
              <li><a href="#" className="hover:text-gray-100">Staff Management</a></li>
              <li><a href="#" className="hover:text-gray-100">Parcel Management</a></li>
              <li><a href="#" className="hover:text-gray-100">Performance Reports</a></li>
              <li><a href="#" className="hover:text-gray-100">Track Parcel</a></li>
            </ul>
        </div>
    );
};

export default QuickLinks;
