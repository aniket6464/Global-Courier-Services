import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../redux/userSlice'; // Import signIn action
import { FaExclamationCircle } from 'react-icons/fa';

const SignIn = ({ isCustomer }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(isCustomer ? 'Customer' : ''); // Default to 'Customer' if isCustomer
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Start loading
    
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: isCustomer ? 'Customer' : role }),
            });
    
            if (!response.ok) {
                throw new Error('Sign-in failed. Please check your credentials.');
            }
    
            const data = await response.json();
            dispatch(signIn(data));
    
            // Navigate based on role
            const roleRoutes = {
                admin: '/admin/dashboard',
                'operations head': '/operations-head/dashboard',
                'main branch manager': '/main-branch-manager/dashboard',
                'regional hub manager': '/regional-hub-manager/dashboard',
                'local office manager': '/local-office-manager/dashboard',
                'Delivery Personnel': '/delivery-personnel/dashboard',
                Customer: '/customer/dashboard',
            };
            navigate(roleRoutes[data.role] || '/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // End loading
        }
    };    

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side - Branding (Optional Split Screen Design) */}
            <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
                <img src="./company-branding.webp" alt="Company Branding" className="w-full h-full object-cover" />
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-16">
                {/* Company Logo */}
                <div className="mb-8 text-center">
                    <img src="./company-logo.png.webp" alt="Company Logo" className="mx-auto w-32 h-32" />
                </div>

                {/* Sign In Form */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSignIn} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 w-full p-3 bg-gray-200 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="mt-1 w-full p-3 bg-gray-200 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            required
                        />
                    </div>

                    {/* Conditionally render the role selection only for non-customers */}
                    {!isCustomer && (
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 font-semibold">Select Your Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Choose your role</option>
                                <option value="admin">Admin</option>
                                <option value="operations head">Operations Head</option>
                                <option value="main branch manager">Main Branch Manager</option>
                                <option value="regional hub manager">Regional Hub Manager</option>
                                <option value="local office manager">Local Office Manager</option>
                                <option value="Delivery Personnel">Delivery Personnel</option>
                            </select>
                        </div>
                    )}

                    {/* Sign In Button */}
                    <div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    </div>
                </form>

                {/* Optional Error Message */}
                {error && (
                    <div className="mt-4 text-red-600 text-center">
                        <FaExclamationCircle className="inline mr-2" /> {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignIn;
