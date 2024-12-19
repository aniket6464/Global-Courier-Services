import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import PrivateRoute from './routes/PrivateRoute';
import AdminHome from './UserRoutes/AdminHome';
import OperationsHeadHome from './UserRoutes/OperationsHeadHome';
import MainBranchManagerHome from './UserRoutes/MainBranchManagerHome';
import RegionalHubManagerHome from './UserRoutes/RegionalHubManagerHome';
import LocalOfficeManagerHome from './UserRoutes/LocalOfficeManagerHome';
import DeliveryPersonnelHome from './UserRoutes/DeliveryPersonnelHome';
import CustomerHome from './UserRoutes/CustomerHome';
import Unauthorized from './pages/Unauthorized';
import CustomerSignUp from './pages/customer/SignUp';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home /> } />

        {/* Public routes */}
        <Route path='/sign-in' element={<SignIn isCustomer={false} />} /> {/* For non-customer users */}
        <Route path='/sign-up' element={<CustomerSignUp />} /> 
        <Route path='/customer-sign-in' element={<SignIn isCustomer={true} />} /> {/* For customer sign-in */}
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* Private routes for all users */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path='/admin/*' element={<AdminHome />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['operations head']} />}>
          <Route path='/operations-head/*' element={<OperationsHeadHome />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['main branch manager']} />}>
          <Route path='/main-branch-manager/*' element={<MainBranchManagerHome />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['regional hub manager']} />}>
          <Route path='/regional-hub-manager/*' element={<RegionalHubManagerHome />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['local office manager']} />}>
          <Route path='/local-office-manager/*' element={<LocalOfficeManagerHome />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['Delivery Personnel']} />}>
          <Route path='/delivery-personnel/*' element={<DeliveryPersonnelHome />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['Customer']} />}>
          <Route path='/customer/*' element={<CustomerHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
