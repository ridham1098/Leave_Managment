import React, { useEffect, useState } from "react";
import LeaveHistory from "../components/LeaveHistory";
import { getLeaveHistory, clearLeaves, updateLeaveStatus } from "../services/LeaveService";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const data = await getLeaveHistory(); // saari leaves (no filter)
      setLeaves(data);
    };
    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateLeaveStatus(id, status);
    const updated = await getLeaveHistory();
    setLeaves(updated);
  };

  const handleClearAll = async () => {
    await clearLeaves();
    toast.success("All leave records cleared!");
    setLeaves([]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#3b0000] to-red-700 flex flex-col items-center p-8">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-extrabold text-white text-center mb-6">Admin Dashboard</h2>
          <p className="text-center text-gray-300 mb-10 text-sm">Manage and review employee leave requests below</p>

          <div className="flex flex-row justify-between">
            <h3 className="text-2xl font-bold text-gray-100 mb-2 border-b border-white/30 inline-block pb-2">
              Employee Leave Records
            </h3>
            <button onClick={handleClearAll}
              className="px-4 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 transition-all text-white shadow-md cursor-pointer">
              Clear All Leave History
            </button>
          </div>

          <LeaveHistory leaves={leaves} onStatusChange={handleStatusChange} isAdmin={true} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminDashboard;