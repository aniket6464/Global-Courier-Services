import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 p-10 ">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-100">About Us</a></li>
              <li><a href="#" className="hover:text-gray-100">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-100">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-100">Support</a></li>
            </ul>
          </div>
      
          {/* Column 2: Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v4m0 0v4m0-4H8m8 0H8m8 0H8" />
                </svg>
                <a href="mailto:support@company.com" className="hover:text-gray-100">support@company.com</a>
              </li>
              <li><a href="#" className="hover:text-gray-100">FAQ</a></li>
              <li><a href="#" className="hover:text-gray-100">Open a Ticket</a></li>
            </ul>
          </div>
      
          {/* Column 3: Quick Links */}
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
      
          {/* Column 4: Legal & Copyright */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9 9m0 0l9-9m-9 9V3" />
                </svg>
                <a href="#" className="hover:text-gray-100">Compliance Guidelines</a>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <a href="#" className="hover:text-gray-100">Security Policies</a>
              </li>
            </ul>
            <div className="mt-6 border-t border-gray-700 pt-4 text-sm text-gray-400">
              <p>Copyright © 2024 Global Courier Services. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      
        {/* Back to Top Button */}
        <div className="mt-8 text-center">
          <button className="text-gray-400 hover:text-gray-100">
            Back to Top
          </button>
        </div>
      </footer>
    );
};

export default Footer;
