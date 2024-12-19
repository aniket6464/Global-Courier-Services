import React, { useState, useEffect } from "react";

const ParcelStatusReport = () => {
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const statuses = [
        "Created",
        "Awaiting Pickup",
        "Picked Up",
        "At Local Office",
        "Out for Local Delivery",
        "In Transit to Regional Hub",
        "At Regional Hub",
        "In Transit to Destination Local Office",
        "At Destination Local Office",
        "In Transit to Main Branch",
        "At Main Branch",
        "In Transit to Destination Main Branch",
        "At Destination Main Branch",
        "In Transit to Destination Regional Hub",
        "At Destination Regional Hub",
        "Out for Delivery",
        "Delivered",
        "Delivery Attempted",
        "Held at Regional Hub",
        "Held at Main Branch",
        "Damaged in Transit",
        "Lost in Transit",
        "Ready to Pickup (at the branch)",
        "Pickup",
    ];
    
    const fetchData = async () => {
        if (!status || !startDate || !endDate) {
            setError("Please fill in all filters to fetch the data.");
            return;
        }
    
        setLoading(true);
        setError("");
        try {
            // Replace spaces with %20 for API compatibility using encodeURIComponent
            const sanitizedStatus = encodeURIComponent(status);
            const response = await fetch(
                `/api/parcel/psr?status=${sanitizedStatus}&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data from the API.");
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-center text-2xl font-bold mb-6">Parcel Status Report</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Select */}
                    <div>
                        <label htmlFor="statusSelect" className="block font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="statusSelect"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            {/* Add all statuses */}
                            {[
                                "Created",
                                "Awaiting Pickup",
                                "Picked Up",
                                "At Local Office",
                                "Out for Local Delivery",
                                "In Transit to Regional Hub",
                                "At Regional Hub",
                                "In Transit to Destination Local Office",
                                "At Destination Local Office",
                                "In Transit to Main Branch",
                                "At Main Branch",
                                "In Transit to Destination Main Branch",
                                "At Destination Main Branch",
                                "In Transit to Destination Regional Hub",
                                "At Destination Regional Hub",
                                "Out for Delivery",
                                "Delivered",
                                "Delivery Attempted",
                                "Held at Regional Hub",
                                "Held at Main Branch",
                                "Damaged in Transit",
                                "Lost in Transit",
                                "Ready to Pickup (at the branch)",
                                "Pickup",
                            ].map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                    {statusOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full md:w-auto bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Generate Report
                </button>
            </form>

            {/* Error Message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Loading Indicator */}
            {loading && <p className="text-gray-500 mt-4">Loading...</p>}

            {/* Data Table */}
            <div className="mt-8 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Sender Name</th>
                            <th className="px-4 py-2 border">Recipient Name</th>
                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(item.date_created).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border">{item.sender_name}</td>
                                    <td className="px-4 py-2 border">{item.recipient_name}</td>
                                    <td className="px-4 py-2 border">{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            !loading && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParcelStatusReport;
