import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ParcelConditionAnalysis = () => {
  const [branchType, setBranchType] = useState(''); // Manage selected branch type
  const [selectedBranch, setSelectedBranch] = useState(''); // Manage selected branch
  const [branches, setBranches] = useState([]); // Store fetched branches
  const [dateRange, setDateRange] = useState([new Date(), new Date()]); // Date range for filtering
  const [graphData, setGraphData] = useState(null); // Store fetched graph data

  // Fetch branch list when branch type changes
  useEffect(() => {
    const fetchBranches = async () => {
      if (!branchType) return;
      const apiMap = {
        main: '/api/branch/main-branch/list',
        regional: '/api/branch/regional-hub/listAll',
        local: '/api/branch/local-office/listAll',
      };
      try {
        const response = await fetch(apiMap[branchType]);
        const data = await response.json();
        setBranches(data);
        setSelectedBranch(''); // Reset selected branch when branch type changes
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      }
    };

    fetchBranches();
  }, [branchType]);

  // Fetch performance data when selected branch or date range changes
  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!selectedBranch || !dateRange[0] || !dateRange[1]) return;

      try {
        const response = await fetch('/api/user/operations-head/pca', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            branch_type: branchType,
            branch_id: selectedBranch,
            start_date: dateRange[0].toISOString().split('T')[0],
            end_date: dateRange[1].toISOString().split('T')[0],
          }),
        });
        const data = await response.json();
        if (!response.ok){
          alert(data.error)
          return;
        }
        setGraphData(data);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      }
    };

    fetchPerformanceData();
  }, [selectedBranch, dateRange]);

  // Handle branch type change
  const handleBranchTypeChange = (e) => {
    setBranchType(e.target.value);
  };

  // Handle branch selection change
  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Parcel Condition Analysis</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Date Range Picker */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date Range:</label>
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => setDateRange(update)}
            dateFormat="yyyy/MM/dd"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
          />
        </div>

        {/* Branch Type Selector */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch Type:</label>
          <select
            value={branchType}
            onChange={handleBranchTypeChange}
            className="block w-full border border-gray-300 p-2 rounded-md shadow-sm"
          >
            <option value="">Select Branch Type</option>
            <option value="main">Main Branch</option>
            <option value="regional">Regional Hub</option>
            <option value="local">Local Office</option>
          </select>
        </div>

        {/* Branch Selector */}
        {branches.length > 0 && (
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch:</label>
            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              className="block w-full border border-gray-300 p-2 rounded-md shadow-sm"
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

      {/* Graphs Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {graphData && (
          <>
            {/* Undamaged Delivery Rate Graph */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Undamaged Delivery Rate</h2>
              <Bar
                data={{
                  labels: graphData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Undamaged Delivery Rate',
                      data: graphData.map((item) => item.undamagedDeliveryRate),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => `${tooltipItem.raw}%`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Percentage (%)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Lost Parcel Rate Graph */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Lost Parcel Rate</h2>
              <Bar
                data={{
                  labels: graphData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Lost Parcel Rate',
                      data: graphData.map((item) => item.lostParcelRate),
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => `${tooltipItem.raw}%`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Percentage (%)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date',
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParcelConditionAnalysis;
