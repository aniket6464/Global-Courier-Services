import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker'; // DatePicker for date range
import 'react-datepicker/dist/react-datepicker.css';

const CustomerSatisfaction = () => {
  const [branchType, setBranchType] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [chartData, setChartData] = useState({
    avgRating: [],
    complaintRate: [],
    labels: [],
  });

  // Fetch branches based on branch type
  useEffect(() => {
    if (!branchType) return;

    const fetchBranches = async () => {
      let url = '';
      switch (branchType) {
        case 'main':
          url = '/api/branch/main-branch/list';
          break;
        case 'regional':
          url = '/api/branch/regional-hub/listAll';
          break;
        case 'local':
          url = '/api/branch/local-office/listAll';
          break;
        default:
          return;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, [branchType]);

  // Fetch satisfaction data when branch or date range changes
  useEffect(() => {
    if (!selectedBranch || !branchType || !dateRange[0] || !dateRange[1]) return;

    const fetchSatisfactionData = async () => {
      const body = {
        branch_type: branchType,
        branch_id: selectedBranch,
        start_date: dateRange[0].toISOString().split('T')[0],
        end_date: dateRange[1].toISOString().split('T')[0],
      };

      try {
        const response = await fetch('/api/user/operations-head/cs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();

        if (!response.ok){
          alert(data.error)
          return;
        }
        setChartData({
          labels: data.map((item) => item.date),
          avgRating: data.map((item) => item.avgCustomerRating),
          complaintRate: data.map((item) => item.customerComplaintRate),
        });
      } catch (error) {
        console.error('Error fetching satisfaction data:', error);
      }
    };

    fetchSatisfactionData();
  }, [selectedBranch, branchType, dateRange]);

  const handleBranchChange = (e) => setSelectedBranch(e.target.value);
  const handleBranchTypeChange = (e) => {
    setBranchType(e.target.value);
    setSelectedBranch('');
    setBranches([]);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Customer Satisfaction</h1>

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

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Customer Rating Graph */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Average Customer Rating</h2>
          <Bar
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: 'Average Customer Rating',
                  data: chartData.avgRating,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: 'top' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Rating (out of 5)' },
                },
                x: {
                  title: { display: true, text: 'Date' },
                },
              },
            }}
          />
        </div>

        {/* Customer Complaint Rate Graph */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Customer Complaint Rate</h2>
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: 'Customer Complaint Rate',
                  data: chartData.complaintRate,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderWidth: 2,
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: 'top' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Complaint Rate (%)' },
                },
                x: {
                  title: { display: true, text: 'Date' },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerSatisfaction;
