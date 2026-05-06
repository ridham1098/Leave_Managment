import React from 'react';
import { useNavigate } from 'react-router-dom';


// NAVBAR - top navigation bar
 function Navbar() {
  const navigate = useNavigate();

  // when logout button is clicked
  const handleLogout = () => {      
    localStorage.removeItem('user'); // deletes user data
    navigate('/');
  };


  return (
    <nav className="bg-gradient-to-br from-black via-[#3b0000] to-red-700 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">

      {/* title */}
      <h1 className="text-2xl font-extrabold text-white">
        Leave Management System | Built by 
        <span className='text-pink-400 '> Ridham </span> 
      </h1>
    
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-5 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
        Logout
      </button>
      
    </nav>
  );
}

export default Navbar