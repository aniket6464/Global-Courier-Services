import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ParcelTransferEfficiency = () => {
  const [branchType, setBranchType] = useState('main');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [graphData, setGraphData] = useState(null);

  // Function to fetch branches based on branch type
  const fetchBranches = async () => {
    try {
      const endpoint =
        branchType === 'main'
          ? '/api/branch/main-branch/list'
          : '/api/branch/regional-hub/listAll';

      const response = await fetch(endpoint);
      const data = await response.json();
      const formattedBranches = data.map((branch) => ({
        id: branch._id,
        name: `${branch.branch_code} - ${branch.city}, ${branch.state}`,
      }));

      setBranches(formattedBranches);
      setSelectedBranch('');
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  // Function to fetch graph data based on filters
  const fetchGraphData = async () => {
    if (!selectedBranch) return;

    try {
      const branchTypeKey =
        branchType === 'main' ? 'main' : 'regional';
      const startDate = dateRange[0].toISOString().split('T')[0];
      const endDate = dateRange[1].toISOString().split('T')[0];

      const response = await fetch('/api/user/operations-head/pte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_type: branchTypeKey,
          branch_id: selectedBranch,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await response.json();
      if (!response.ok){
        alert(data.error)
        return;
      }
      const dates = data.map((entry) => entry.date);
      const processingTimes = data.map((entry) => entry.avgProcessingTime);
      const avgProcessingTime =
        processingTimes.reduce((sum, time) => sum + time, 0) /
        processingTimes.length;

      setGraphData({ dates, processingTimes, avgProcessingTime });
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  // Effect to load branches when branch type changes
  useEffect(() => {
    fetchBranches();
  }, [branchType]);

  // Effect to load graph data when filters change
  useEffect(() => {
    fetchGraphData();
  }, [selectedBranch, dateRange]);

  const handleBranchTypeChange = (event) => {
    setBranchType(event.target.value);
  };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setDateRange([start, end]);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 }, color: '#4B5563' },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date', font: { size: 16 }, color: '#4B5563' },
        ticks: { font: { size: 12 }, color: '#374151', padding: 10 },
      },
      y: {
        title: { display: true, text: 'Avg Processing Time (hours)', font: { size: 16 }, color: '#4B5563' },
        ticks: { font: { size: 12 }, color: '#374151', padding: 10 },
        grid: { color: '#E5E7EB' },
      },
    },
  };

  const getChartData = () => ({
    labels: graphData?.dates || [],
    datasets: [
      {
        label: 'Avg Processing Time',
        data: graphData?.processingTimes || [],
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Parcel Transfer Efficiency</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date Range:</label>
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            dateFormat="yyyy/MM/dd"
            className="border border-gray-300 p-2 rounded-md shadow-sm"
          />
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch Type:</label>
          <select
            value={branchType}
            onChange={handleBranchTypeChange}
            className="block w-full border border-gray-300 p-2 rounded-md shadow-sm"
          >
            <option value="main">Main Branch</option>
            <option value="regional">Regional Hub</option>
          </select>
        </div>

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
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="w-full mb-6">
        {graphData ? (
          <Line data={getChartData()} options={chartOptions} />
        ) : (
          <p>Loading graph data...</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Key Insights</h2>
        <p className="text-gray-700">Avg Processing Time: {graphData?.avgProcessingTime?.toFixed(2)} hours</p>
      </div>

      <div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Give Feedback
        </button>
      </div>
    </div>
  );
};

export default ParcelTransferEfficiency;
