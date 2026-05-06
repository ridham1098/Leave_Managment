import React, { useState } from 'react';
import toast from 'react-hot-toast';

function LeaveForm({ onSubmit, MAX_LEAVES, leaves }) {

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    reason: ''
  });
  const userName = localStorage.getItem("user") || "Unknown User";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.reason) {
      toast.error("Please fill all fields before submitting!")
      return
    };

    const from = new Date(formData.from);
    const to = new Date(formData.to);
    const newLeaveDays = (to - from) / (1000 * 60 * 60 * 24) + 1;
    if (newLeaveDays <= 0) {
      toast.error("Invalid date range!");
      return;
    }

    const approvedDays = (leaves || []).reduce((total, leave) => {
      if (leave.status === "Approved") {
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        return total + ((to - from) / (1000 * 60 * 60 * 24) + 1);
      }
      return total;
    }, 0);

    const remainingBalance = MAX_LEAVES - approvedDays;
    if (newLeaveDays > remainingBalance) {
      toast.error("Not enough leave balance!");
      return;
    }

    onSubmit({
      ...formData,
      employeeName: userName,
      status: 'Pending',
      // id hataya — Firestore khud ID deta hai
    });
    toast.success("Leave submitted successfully!");
    setFormData({ from: '', to: '', reason: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-6 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl text-white space-y-6 transition-all duration-300 hover:shadow-blue-400/40 w-full max-w-lg mx-auto hover:scale-105">

      <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-black via-[#3b0000] to-red-700 text-transparent bg-clip-text drop-shadow-lg shadow-pink-500/60 hover:shadow-blue-400/80 transition-all duration-300 mb-6 flex items-center gap-2">
        New Leave Request
      </h3>

      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> From Date: </label>
        <input
          type="date"
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-blue-400 focus:border-blue-400 transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> To Date: </label>
        <input
          type="date"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> Reason: </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-none"
          rows="4"
          placeholder="Enter reason for leave"
          required
        />
      </div>

      <button type="submit" className="w-full py-3 rounded-xl font-semibold bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:scale-105 hover:shadow-blue-400/50 transition-all duration-300 cursor-pointer">
        Apply Leave
      </button>

      <p className="text-sm text-gray-300 text-center mb-4">
        <span className='font-bold'>Note:</span> For a single-day leave, please enter the same date in both <span className='font-bold'>From Date</span> and <span className='font-bold'>To Date</span> fields.
      </p>
    </form>
  );
}

export default LeaveForm











