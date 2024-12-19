import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewParcelRequest from '../pages/AddNewParcel';
import MyRequests from '../pages/customer/MyRequests';
import ActiveParcels from '../pages/customer/CustomerParcelList';
import TrackParcel from '../pages/TrackParcel';
import ParcelHistory from '../pages/customer/ParcelHistory';
import UpdateParcelRequest from '../pages/customer/UpdateParcelRequest';

const CustomerParcelManagement = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          {/* New Parcel Request Route */}
          <Route path="new-request" element={<NewParcelRequest isCustomer={true} />} />
          <Route path="update-request/:id" element={<UpdateParcelRequest />} />

          {/* My Requests Route */}
          <Route path="my-requests" element={<MyRequests isCustomer={true}/>} />

          {/* Active Parcels Route */}
          <Route path="active-parcels" element={<ActiveParcels role={"customer"}/>} />

          {/* Track Parcel Route */}
          <Route path="track-parcel/:trackingNumber" element={<TrackParcel />} />
          <Route path="track-parcel/" element={<TrackParcel />} />

          {/* Parcel History Route */}
          <Route path="parcel-history" element={<ParcelHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerParcelManagement;
