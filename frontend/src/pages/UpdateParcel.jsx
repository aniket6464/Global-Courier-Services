import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UpdateParcel() {
    const { currentUser } = useSelector((state) => state.user);
    const { id } = useParams(); // Extract the parcel ID from the route parameters
    const [formData, setFormData] = useState({
        sender_name: '',
        sender_address: '',
        sender_contact: '',
        recipient_name: '',
        recipient_address: '',
        recipient_contact: '',
        parcel_details: [{ weight: '', height: '', width: '', length: '', price: '' }],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParcelDetails = async () => {
            try {
                const response = await fetch(`/api/parcel/read/${id}`);
                if (!response.ok) throw new Error('Failed to fetch parcel details');
                const data = await response.json();
                setFormData({
                    sender_name: data.sender_name,
                    sender_address: data.sender_address,
                    sender_contact: data.sender_contact,
                    recipient_name: data.recipient_name,
                    recipient_address: data.recipient_address,
                    recipient_contact: data.recipient_contact,
                    parcel_details: data.parcel_details,
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchParcelDetails();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...formData.parcel_details];
        updatedItems[index] = {
            ...updatedItems[index],
            [name]: value,
        };
        setFormData((prevData) => ({
            ...prevData,
            parcel_details: updatedItems,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`/api/parcel/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update parcel');

            alert('Parcel updated successfully');
            switch (currentUser.role) {
                case "local office manager":
                navigate(`/local-office-manager/parcel-management/list`);
                break;
                case "regional hub manager":
                navigate(`/regional-hub-manager/parcel-management/list`);
                break;
                case "main branch manager":
                navigate(`/main-branch-manager/parcel-management/list`);
                break;
                default:
                alert("You do not have permission to update this parcel.");
            }      
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Update Parcel</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="mx-4 px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            Update Parcel
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

export default UpdateParcel;
