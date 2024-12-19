import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import components for each section
import CreateParcel from '../pages/AddNewParcel';
import ListParcels from '../pages/ParcelList';
import CustomerRequests from '../pages/customer/MyRequests';
import TrackParcel from '../pages/TrackParcel';
import UpdateParcel from '../pages/UpdateParcel';

const ParcelManagement = ({ isLocalManager }) => {
  const { currentUser } = useSelector((state) => state.user);
  const admin = currentUser.role === 'admin'

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          {/* Create New Parcel Route */}
          <Route path="create" element={<CreateParcel />} />
          <Route path="update/:id" element={<UpdateParcel />} />

          {/* List of Parcels Route */}
          <Route path="list" element={<ListParcels isAdmin={admin}/>} />

          {/* Customer Requests Route (only visible to local manager) */}
          {isLocalManager && (
            <Route path="customer-requests" element={<CustomerRequests isCustomer={false}/>} />
          )}

          {/* Track Parcel Route */}
          <Route path="track/:trackingNumber" element={<TrackParcel />} />
          <Route path="track/" element={<TrackParcel />} />
        </Routes>
      </div>
    </div>
  );
};

export default ParcelManagement;
