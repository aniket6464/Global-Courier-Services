import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNewBranch from '../pages/admin/AddNewBranch';
import MainBranch from '../pages/admin/listBranch/MainBranch';
import RegionalHub from '../pages/admin/listBranch/RegionalHub';
import LocalOffice from '../pages/admin/listBranch/LocalOffice';
import UpdateBranch from '../pages/admin/UpdateBranch';

const BranchManagement = () => {
  return (
    <Routes>
      {/* Route to add a new branch */}
      <Route path="add-new" element={<AddNewBranch />} />

      {/* Route to list branches */}
      <Route path="list-main" element={<MainBranch />} />
      <Route path="list-regional" element={<RegionalHub />} />
      <Route path="list-local" element={<LocalOffice />} />

      {/* Route to update a branch with ID parameter */}
      <Route path="update-main/:id" element={<UpdateBranch branchType="main-branch" />} />
      <Route path="update-regional/:id" element={<UpdateBranch branchType="regional-hub" />} />
      <Route path="update-local/:id" element={<UpdateBranch branchType="local-office" />} />
    </Routes>
  );
};

export default BranchManagement;
