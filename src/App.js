import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveTracker from './pages/LiveTracker';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import DriverSidebar from './components/DriverSidebar';
import AssignRoutes from './pages/AssignRoutes';
function App() {
const loginEmail = localStorage.getItem("email");


  
  return (

      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/driver/*" element={<DriverSidebar />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tracker" element={<LiveTracker />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assignRoutes" element={<AssignRoutes afterLoginEmail={loginEmail}/>} />
        </Route>
      </Routes>

  );
}

export default App;
