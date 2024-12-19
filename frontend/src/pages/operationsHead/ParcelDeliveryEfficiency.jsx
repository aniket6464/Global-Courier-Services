import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ParcelDeliveryEfficiency = () => {
  const [branchType, setBranchType] = useState('main');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [deliveryTimeData, setDeliveryTimeData] = useState(null);
  const [onTimeRateData, setOnTimeRateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const branchAPI = {
    'main': '/api/branch/main-branch/list',
    'regional': '/api/branch/regional-hub/listAll',
    'local': '/api/branch/local-office/listAll',
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch(branchAPI[branchType]);
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

  const fetchPerformanceData = async () => {
    if (!selectedBranch) return;

    const [start, end] = dateRange;
    const body = {
      branch_type: branchType.toLowerCase().replace(' ', '-'),
      branch_id: selectedBranch,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    };

    try {
      setLoading(true);
      const response = await fetch('/api/user/operations-head/pde', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      if (!response.ok){
        alert(data.error)
        return;
      }
      setDeliveryTimeData({
        dates: data.map((entry) => entry.date),
        deliveryTimes: data.map((entry) => entry.avgDeliveryTime),
      });
      setOnTimeRateData({
        dates: data.map((entry) => entry.date),
        onTimeRates: data.map((entry) => entry.onTimeDeliveryRate),
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [branchType]);

  useEffect(() => {
    fetchPerformanceData();
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

  const deliveryTimeChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Date', font: { size: 14 } } },
      y: { title: { display: true, text: 'Avg Delivery Time (days)', font: { size: 14 } } },
    },
  };

  const onTimeRateChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Date', font: { size: 14 } } },
      y: { title: { display: true, text: 'On-Time Delivery Rate (%)', font: { size: 14 } } },
    },
  };

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-semibold mb-4">Parcel Delivery Efficiency</h1>

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
            <option value="local">Local Office</option>
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

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Average Delivery Time</h2>
          {deliveryTimeData ? (
            <Line
              data={{
                labels: deliveryTimeData.dates,
                datasets: [
                  {
                    label: 'Avg Delivery Time (days)',
                    data: deliveryTimeData.deliveryTimes,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.1,
                  },
                ],
              }}
              options={deliveryTimeChartOptions}
            />
          ) : loading ? (
            <p>Loading data...</p>
          ) : (
            <p>No data available.</p>
          )}
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-semibold mb-2">On-Time Delivery Rate</h2>
          {onTimeRateData ? (
            <Bar
              data={{
                labels: onTimeRateData.dates,
                datasets: [
                  {
                    label: 'On-Time Delivery Rate (%)',
                    data: onTimeRateData.onTimeRates,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  },
                ],
              }}
              options={onTimeRateChartOptions}
            />
          ) : loading ? (
            <p>Loading data...</p>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelDeliveryEfficiency;
