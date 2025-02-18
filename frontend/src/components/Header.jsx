import React, { useEffect, useState } from 'react';
import { FaUser, FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../redux/userSlice';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    // Toggle the dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#user-avatar-dropdown")) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Handle logout
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
            dispatch(signOut());

            // Redirect to sign-in page after logout
            if (currentUser.role === 'Customer') {
                navigate('/customer-sign-in');
            } else {
                navigate('/sign-in');
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Determine profile navigation URL
    const getProfileUrl = () => {
        switch (currentUser?.role) {
            case 'admin':
                return '/admin/profile';
            case 'operations head':
                return '/operations-head/profile';
            case 'main branch manager':
                return '/main-branch-manager/profile';
            case 'regional hub manager':
                return '/regional-hub-manager/profile';
            case 'local office manager':
                return '/local-office-manager/profile';
            case 'Delivery Personnel':
                return '/delivery-personnel/profile';
            case 'Customer':
                return '/customer/profile';
            default:
                return '/profile';
        }
    };

    return (
      <header className="bg-gray-900 p-4 flex items-center justify-between shadow-md">
        {/* System Name / Brand Logo */}
        <div className="flex items-center space-x-4">
          <a href="/dashboard" className="flex items-center space-x-2">
            <img
              src="/company-logo.png.webp"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-xl font-extrabold text-white tracking-wide">
              Global Courier Services
            </span>
          </a>
        </div>

        {/* Welcome Message */}
        <div className="hidden md:block text-white text-lg px-6">
          <span className="font-semibold">Welcome, {currentUser?.name || "User"}</span>
        </div>

        {/* Profile, Dropdown, and System Settings */}
        <div className="ml-auto flex items-center space-x-6">
          {/* System Settings Icon */}
          <a
            href="/admin/settings"
            className="text-white hover:text-gray-300 transition ease-in-out duration-200 transform hover:scale-110"
            aria-label="System Settings"
          >
            <FaCog className="h-6 w-6" />
          </a>

          {/* User Avatar and Dropdown */}
          <div className="relative" id="user-avatar-dropdown">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition duration-200"
              onClick={toggleDropdown}
            >
              <span className="hidden md:block text-white font-medium">
                {currentUser?.name || "[User Name]"}
              </span>
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                <FaUser className="text-white h-5 w-5" />
              </div>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <a
                  href={getProfileUrl()}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  View Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
};

export default Header;
