import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AddNewParcel({ isCustomer }) {
    const [formData, setFormData] = useState({
        sender_name: '',
        sender_address: '',
        sender_contact: '',
        recipient_name: '',
        recipient_address: '',
        recipient_contact: '',
        type: '', // Default to empty for placeholder
        branch_id: '',
        parcel_details: [{ weight: '', height: '', width: '', length: '', price: '' }],
    });    

    const [branches, setBranches] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    // Fetch branch list only if isCustomer is true
    useEffect(() => {
        if (isCustomer) {
            const fetchBranches = async () => {
                try {
                    const response = await fetch('/api/branch/local-office/list');
                    if (!response.ok) throw new Error('Failed to fetch branches');
                    const data = await response.json();
                    setBranches(data);
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchBranches();
        }
    }, [isCustomer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        console.log(formData)
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
    
        // Create a shallow copy of items to ensure immutability
        const updatedItems = [...formData.parcel_details];
    
        // Update the specific item in the array
        updatedItems[index] = {
            ...updatedItems[index],
            [name]: value,
        };
    
        // Update the state with the new items array
        setFormData((prevData) => ({
            ...prevData,
            parcel_details: updatedItems,
        }));
    };    

    const addItem = () => {
        setFormData({
            ...formData,
            parcel_details: [...formData.parcel_details, { weight: '', height: '', width: '', length: '', price: '' }],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const apiUrl = isCustomer ? '/api/user/customer/req-create' : '/api/parcel/create';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to submit form');

            const data = await response.json();
            let redirectUrl = '/'; // Default route

            // Determine redirect URL based on user role
            switch (currentUser.role) {
                case 'admin':
                    redirectUrl = '/admin/parcel-management/list';
                    break;
                case 'main branch manager':
                    redirectUrl = '/main-branch-manager/parcel-management/list';
                    break;
                case 'regional hub manager':
                    redirectUrl = '/regional-hub-manager/parcel-management/list';
                    break;
                case 'local office manager':
                    redirectUrl = '/local-office-manager/parcel-management/list';
                    break;
                case 'Customer':
                    redirectUrl = '/customer/parcel-management/my-requests';
                    break;
                default:
                    redirectUrl = '/';
            }

            alert('Form submitted successfully');
            navigate(redirectUrl);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-8 shadow-lg m-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isCustomer ? 'Parcel Request' : 'Create Parcel'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Sender Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sender Name</label>
                            <input
                                type="text"
                                name="sender_name"
                                value={formData.sender_name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter sender's name"
                            />
                        </div>
                        {/* Sender Contact */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sender Contact</label>
                            <input
                                type="tel"
                                name="sender_contact"
                                value={formData.sender_contact}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter sender's contact"
                            />
                        </div>
                        {/* Sender Address */}
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">Sender Address</label>
                            <textarea
                                name="sender_address"
                                value={formData.sender_address}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter sender's address"
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recipient Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Recipient Name</label>
                            <input
                                type="text"
                                name="recipient_name"
                                value={formData.recipient_name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter recipient's name"
                            />
                        </div>
                        {/* Recipient Contact */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Recipient Contact</label>
                            <input
                                type="tel"
                                name="recipient_contact"
                                value={formData.recipient_contact}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter recipient's contact"
                            />
                        </div>
                        {/* Recipient Address */}
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">Recipient Address</label>
                            <textarea
                                name="recipient_address"
                                value={formData.recipient_address}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter recipient's address"
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Parcel Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Parcel Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {/* Placeholder option */}
                            <option value="" disabled>
                                Select Parcel Type
                            </option>
                            <option value="Deliver">Deliver</option>
                            <option value="Pickup">Pickup</option>
                        </select>
                    </div>

                        {/* Branch Selector */}
                        {isCustomer && (
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Select Branch</label>
                                <select
                                    name="branch_id" // Updated to match formData property
                                    value={formData.branch_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.branch_code} - {branch.city}, {branch.state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Parcel Details */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Parcel Details</label>
                        {formData.parcel_details.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                <input
                                    type="number"
                                    name="weight"
                                    value={item.weight}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Weight (kg)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    name="height"
                                    value={item.height}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Height (cm)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    name="width"
                                    value={item.width}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Width (cm)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    name="length"
                                    value={item.length}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Length (cm)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    name="price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, e)}
                                    placeholder="Price ($)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItem}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Add Item
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {error && (
                    <div className="mb-4 text-red-500 text-center font-semibold">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddNewParcel;
