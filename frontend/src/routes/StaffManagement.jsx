import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateNewStaff from '../pages/admin/CreateNewStaff';
import ListStaff from '../pages/ListStaff';
import ListOperationsHead from '../pages/admin/ListOperationsHead';

const StaffManagement = () => {
  return (
    <Routes>
      {/* Route to create a new staff member */}
      <Route path="create-new" element={<CreateNewStaff />} />

      {/* Routes to list different staff roles */}
      <Route path="list-operations-head" element={<ListOperationsHead />} />
      <Route path="list-main-branch-manager" element={<ListStaff staffType="main-branch-manager" />} />
      <Route path="list-regional-hub-manager" element={<ListStaff staffType="regional-hub-manager" />} />
      <Route path="list-local-office-manager" element={<ListStaff staffType="local-office-manager" />} />
      <Route path="list-delivery-personnel" element={<ListStaff staffType="delivery-personnel" />} />
    </Routes>
  );
};

export default StaffManagement;
