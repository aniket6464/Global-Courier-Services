import React, { useState, useEffect } from 'react';

const parametersList = [
  "Average Processing Time",
  "Average Delivery Time",
  "On-Time Delivery Rate",
  "Accuracy of Delivery",
  "Undamaged Delivery Rate",
  "Lost Parcel Rate",
  "Average Customer Rating",
  "Complaint Rate",
];

const apiEndpoints = {
  "Main Branch": "/api/branch/main-branch/performance?limit=100",
  "Regional Hub": "/api/branch/regional-hub/performance?limit=100",
  "Local Office": "/api/branch/local-office/performance?limit=100"
};

const ComparisonPage = ({ branchTypeProp = "All" }) => {
  const [branchType, setBranchType] = useState(branchTypeProp === "All" ? '' : branchTypeProp);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([
    "Average Processing Time", "Average Customer Rating", "Accuracy of Delivery"
  ]);

  useEffect(() => {
    if (branchTypeProp !== "All") {
      setBranchType(branchTypeProp);
    }
  }, [branchTypeProp]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (branchType) {
        try {
          const response = await fetch(apiEndpoints[branchType]);
          const data = await response.json();
          const branchDataKey = branchType === "Main Branch" ? "branches" 
                            : branchType === "Regional Hub" ? "hubs" 
                            : "offices";

          setBranches(data[branchDataKey].map(branch => ({
            id: branch._id,
            code: branch.branch_code,
            performance: branch.performance_tracking
          })));
        } catch (error) {
          console.error('Error fetching branches:', error);
        }
      }
    };

    fetchBranches();
  }, [branchType]);

  const handleBranchTypeChange = (e) => {
    setBranchType(e.target.value);
    setSelectedBranches([]);
    setBranches([]);
  };

  const handleAddBranch = (branch) => {
    if (selectedBranches.length < 3 && !selectedBranches.includes(branch)) {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleRemoveBranch = (branch) => {
    setSelectedBranches(selectedBranches.filter(b => b !== branch));
  };

  const handleParameterChange = (param) => {
    if (selectedParameters.includes(param)) {
      setSelectedParameters(selectedParameters.filter(p => p !== param));
    } else {
      setSelectedParameters([...selectedParameters, param]);
    }
  };

  const handleReset = () => {
    setBranchType(branchTypeProp === "All" ? '' : branchTypeProp);
    setSelectedBranches([]);
    setSelectedParameters(["Average Processing Time", "Average Customer Rating", "Accuracy of Delivery"]);
  };

  const calculateMetric = (metric, performance) => {
    switch (metric) {
      case "On-Time Delivery Rate":
        return performance.total_delivered_parcels
          ? (performance.total_on_time_delivered_parcels / performance.total_delivered_parcels).toFixed(2)
          : "N/A";
      case "Accuracy of Delivery":
        return performance.total_parcels
          ? ((performance.total_parcels - performance.delivery_attempted) / performance.total_parcels).toFixed(2)
          : "N/A";
      case "Undamaged Delivery Rate":
        return performance.total_parcels
          ? ((performance.total_parcels - performance.damaged_in_transit) / performance.total_parcels).toFixed(2)
          : "N/A";
      case "Lost Parcel Rate":
        return performance.total_parcels
          ? ((performance.lost_in_transit / performance.total_parcels) * 100).toFixed(2)
          : "N/A";
      case "Complaint Rate":
        return performance.total_delivered_parcels
          ? (performance.total_complaints / performance.total_delivered_parcels).toFixed(2)
          : "N/A";
      default:
        return performance[metric.toLowerCase().replace(/ /g, '_')] || "N/A";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-semibold">Branch Comparison Tool</h1>
        <p className="text-gray-600">Select branch type, branches, and parameters to compare performance.</p>
      </header>

      {branchTypeProp === "All" && (
        <section className="mb-8">
          <label className="block text-lg font-medium mb-2">Select Branch Type:</label>
          <select
            value={branchType}
            onChange={handleBranchTypeChange}
            className="block w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="" disabled>Select branch type</option>
            <option value="Main Branch">Main Branch</option>
            <option value="Regional Hub">Regional Hub</option>
            <option value="Local Office">Local Office</option>
          </select>
        </section>
      )}

      <section className="mb-8">
        <div className="flex flex-wrap gap-4">
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => handleAddBranch(branch.code)}
              disabled={selectedBranches.includes(branch.code)}
              className={`p-2 border ${selectedBranches.includes(branch.code) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white cursor-pointer hover:bg-gray-100'} rounded-md`}
            >
              {branch.code}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {selectedBranches.map((branch, index) => (
            <div key={index} className="flex items-center bg-blue-100 px-4 py-2 rounded-md">
              {branch}
              <button onClick={() => handleRemoveBranch(branch)} className="ml-2 text-red-500 font-bold">x</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Compare Parameters</h2>
        <div className="flex flex-wrap gap-4">
          {parametersList.map((param, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedParameters.includes(param)}
                onChange={() => handleParameterChange(param)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>{param}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Comparison Table</h2>
        {selectedBranches.length > 0 && selectedParameters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                  {selectedBranches.map((branch, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{branch}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedParameters.map((param, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{param}</td>
                    {selectedBranches.map((branch, bIndex) => {
                      const branchData = branches.find(b => b.code === branch);
                      return (
                        <td key={bIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {branchData ? calculateMetric(param, branchData.performance) : "--"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Please select branches and parameters to compare.</p>
        )}
      </section>

      <div className="flex justify-center space-x-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Compare</button>
        <button onClick={handleReset} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Reset</button>
      </div>
    </div>
  );
};

export default ComparisonPage;
