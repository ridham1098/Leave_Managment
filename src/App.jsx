<<<<<<< HEAD
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage      from './Pages/LoginPage';
import Dashboard      from './Pages/DashboardPage';
import AdminDashboard from './Pages/AdminDashboard';
import ReviewPage     from './Pages/ReviewPage';
import { Toaster }    from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin"    element={<AdminDashboard />} />
          {/* Magic Link Review Page — NO LOGIN NEEDED */}
          <Route path="/review"   element={<ReviewPage />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
=======
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/DashboardPage';
import AdminDashboard from './Pages/AdminDashboard';
import {Toaster} from "react-hot-toast"

// App Component - Sets up all routes , setup toast notifications 
  
function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} /> 
    <BrowserRouter>    
      <Routes> 
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/admin" element={<AdminDashboard />} />
        {/* Redirects unknown routes to LoginPage */}
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>
    </BrowserRouter>
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
    </>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
