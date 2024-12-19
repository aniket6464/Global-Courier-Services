import React, { useEffect, useState } from 'react';

const RegionalHubReport = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch('/api/branch/regional-hub/performanceByid');
        const branch = await response.json();

        const performanceMetrics = {
          branch_code: branch.branch_code,
          parcel_transfer_efficiency: {
            average_processing_time: branch.performance_tracking.average_processing_time,
          },
          parcel_delivery_efficiency: {
            delivery_speed: branch.performance_tracking.average_delivery_time,
            on_time_delivery_rate:
              ((branch.performance_tracking.total_on_time_delivered_parcels / branch.performance_tracking.total_delivered_parcels) || 0) * 100,
          },
          parcel_condition: {
            undamaged_delivery_rate:
              ((branch.performance_tracking.total_parcels - branch.performance_tracking.damaged_in_transit) / branch.performance_tracking.total_parcels || 0) * 100,
            lost_parcel_rate: ((branch.performance_tracking.lost_in_transit / branch.performance_tracking.total_parcels) || 0) * 100,
          },
          customer_satisfaction: {
            average_rating: branch.performance_tracking.average_customer_rating,
            complaint_rate:
              ((branch.performance_tracking.total_complaints / branch.performance_tracking.total_parcels) || 0) * 100,
          },
        };

        setData(performanceMetrics);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, []);

  if (!data) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-6">Regional Hub Performance Report</h1>

      {/* Parcel Transfer Efficiency Section */}
      <section className="mb-8 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Parcel Transfer Efficiency</h2>
        <div className="flex justify-between items-center">
          <div className="text-gray-700">Average Processing Time</div>
          <div className="text-blue-600 font-bold">{data.parcel_transfer_efficiency.average_processing_time.toFixed(2)} Hours</div>
        </div>
      </section>

      {/* Parcel Delivery Efficiency Section */}
      <section className="mb-8 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Parcel Delivery Efficiency</h2>

        {/* Delivery Speed */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Delivery Speed</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Average Delivery Time</span>
            <span className="text-blue-600 font-bold">{data.parcel_delivery_efficiency.delivery_speed.toFixed(2)} Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">On-Time Delivery Rate</span>
            <span className="text-blue-600 font-bold">{data.parcel_delivery_efficiency.on_time_delivery_rate.toFixed(2)}%</span>
          </div>
        </div>

        {/* Parcel Condition */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Parcel Condition</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Undamaged Delivery Rate</span>
            <span className="text-blue-600 font-bold">{data.parcel_condition.undamaged_delivery_rate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Lost Parcel Rate</span>
            <span className="text-blue-600 font-bold">{data.parcel_condition.lost_parcel_rate.toFixed(2)}%</span>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Section */}
      <section className="mb-8 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Customer Satisfaction</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Average Customer Rating</span>
          <span className="text-blue-600 font-bold">{data.customer_satisfaction.average_rating.toFixed(2)}/5</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Complaint Rate</span>
          <span className="text-blue-600 font-bold">{data.customer_satisfaction.complaint_rate.toFixed(2)}%</span>
        </div>
      </section>
    </div>
  );
};

export default RegionalHubReport;
