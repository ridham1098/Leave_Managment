<<<<<<< HEAD
// src/components/LeaveForm.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createMagicToken } from '../utils/magicLink';
import { sendLeaveRequestEmail } from '../utils/emailService';

function LeaveForm({ onSubmit, MAX_LEAVES, leaves }) {

  const [formData, setFormData] = useState({ from: '', to: '', reason: '' });
  const userName  = localStorage.getItem("user")  || "Unknown User";
  const userEmail = localStorage.getItem("email") || "";
=======
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

<<<<<<< HEAD
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.from || !formData.to || !formData.reason) {
      toast.error("Please fill all fields before submitting!");
      return;
    }

    const from = new Date(formData.from);
    const to   = new Date(formData.to);
    const newLeaveDays = (to - from) / (1000 * 60 * 60 * 24) + 1;


  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.reason) {
      toast.error("Please fill all fields before submitting!")
      return
    };

    const from = new Date(formData.from);
    const to = new Date(formData.to);
    const newLeaveDays = (to - from) / (1000 * 60 * 60 * 24) + 1;
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
    if (newLeaveDays <= 0) {
      toast.error("Invalid date range!");
      return;
    }

    const approvedDays = (leaves || []).reduce((total, leave) => {
      if (leave.status === "Approved") {
<<<<<<< HEAD
        const f = new Date(leave.from);
        const t = new Date(leave.to);
        return total + ((t - f) / (1000 * 60 * 60 * 24) + 1);
=======
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        return total + ((to - from) / (1000 * 60 * 60 * 24) + 1);
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
      }
      return total;
    }, 0);

    const remainingBalance = MAX_LEAVES - approvedDays;
    if (newLeaveDays > remainingBalance) {
      toast.error("Not enough leave balance!");
      return;
    }

<<<<<<< HEAD
    try {
      // 1. Save to Firestore via parent — get docRef back
      const docRef = await onSubmit({
        ...formData,
        employeeName:  userName,
        employeeEmail: userEmail,
        totalDays:     newLeaveDays,
        status:        'Pending',
      });

      // 2. Create magic token + send HR email
      if (docRef?.id) {
        const leaveData = {
          employeeName:  userName,
          employeeEmail: userEmail,
          from:          formData.from,
          to:            formData.to,
          totalDays:     newLeaveDays,
          reason:        formData.reason,
        };
        const token  = await createMagicToken(docRef.id, leaveData);
        const result = await sendLeaveRequestEmail(leaveData, token);
        if (result.success) {
          toast.success("Leave has been Submitted successfully || ✉️");
        } else {
          toast.success("Leave submitted! (Email notification failed — please inform HR manually)");
        }
      } else {
        toast.success("Leave submitted successfully!");
      }

      setFormData({ from: '', to: '', reason: '' });
    } catch (err) {
      toast.error("Something went wrong: " + err.message);
    }
  }
=======
    onSubmit({
      ...formData,
      employeeName: userName,
      status: 'Pending',
      // id hataya — Firestore khud ID deta hai
    });
    toast.success("Leave submitted successfully!");
    setFormData({ from: '', to: '', reason: '' });
  };
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36

  return (
    <form onSubmit={handleSubmit} className="my-8 p-6 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl text-white space-y-6 transition-all duration-300 hover:shadow-blue-400/40 w-full max-w-lg mx-auto hover:scale-105">

      <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-black via-[#3b0000] to-red-700 text-transparent bg-clip-text drop-shadow-lg shadow-pink-500/60 hover:shadow-blue-400/80 transition-all duration-300 mb-6 flex items-center gap-2">
        New Leave Request
      </h3>

      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> From Date: </label>
<<<<<<< HEAD
        <input type="date" name="from" value={formData.from} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-blue-400 focus:border-blue-400 transition" required/>
=======
        <input
          type="date"
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-blue-400 focus:border-blue-400 transition"
          required
        />
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> To Date: </label>
<<<<<<< HEAD
        <input type="date" name="to" value={formData.to} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition" required/>
=======
        <input
          type="date"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          required
        />
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
      </div>

      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1"> Reason: </label>
<<<<<<< HEAD
        <textarea name="reason" value={formData.reason} onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition resize-none"
          rows="4" placeholder="Enter reason for leave" required/>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-300">
        📧 HR will receive an email with a secure review link when you submit.
      </div>

      <button type="submit"
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:scale-105 hover:shadow-blue-400/50 transition-all duration-300 cursor-pointer">
=======
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
>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
        Apply Leave
      </button>

      <p className="text-sm text-gray-300 text-center mb-4">
        <span className='font-bold'>Note:</span> For a single-day leave, please enter the same date in both <span className='font-bold'>From Date</span> and <span className='font-bold'>To Date</span> fields.
      </p>
    </form>
  );
}

<<<<<<< HEAD
export default LeaveForm;
=======
export default LeaveForm











>>>>>>> 018074ca9632d36f0f1dd6be9a5a93a395e84e36
