// src/Pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import LeaveForm from '../components/LeaveForm';
import LeaveHistory from '../components/LeaveHistory';
import { saveLeave, getLeaveHistory, updateLeaveStatus } from '../services/LeaveService';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import LeaveBalance from '../components/LeaveBalance';

import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
function Dashboard() {
  const user = localStorage.getItem('user') || 'User';
  const [leaves, setLeaves] = useState([]);
  const MAX_LEAVES = 10;

  // PEHLE — sirf ek baar load hota tha
useEffect(() => {
  const fetchLeaves = async () => {
    const data = await getLeaveHistory(user);
    setLeaves(data);
  };
  fetchLeaves();
}, []);

// AB — real-time listener (auto update!)

useEffect(() => {
  const q = query(
    collection(db, 'leaves'),
    where('employeeName', '==', user)
  );

  // Real-time listener — HR approve kare toh turant update!
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({ 
      id: d.id, 
      ...d.data() 
    }));
    setLeaves(data);
  });

  return () => unsubscribe(); // cleanup
}, []);
  // Returns docRef so LeaveForm can create magic token
  const handleNewLeave = async (newLeave) => {
    const docRef = await saveLeave(newLeave);
    const updated = await getLeaveHistory(user);
    setLeaves(updated);
    return docRef; // ← important!
  };

  const handleStatusChange = async (id, status) => {
    await updateLeaveStatus(id, status);
    const updated = await getLeaveHistory(user);
    setLeaves(updated);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#3b0000] to-red-700 p-4 md:p-8 flex flex-col items-center">
        <div className='w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
          <h2 className="text-4xl font-extrabold text-white text-center drop-shadow-lg mb-8">
            Welcome, <span className='text-pink-400'>{user}</span>
          </h2>

          <section className="mb-8">
            <div className="flex justify-center">
              <LeaveBalance leaves={leaves} MAX_LEAVES={MAX_LEAVES} />
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-100 mb-2 border-b border-white/30 inline-block pb-2">
              Apply for Leave
            </h3>
            <div className="mt-6 flex justify-center">
              <LeaveForm onSubmit={handleNewLeave} leaves={leaves} MAX_LEAVES={MAX_LEAVES} />
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-100 mb-2 border-b border-white/30 inline-block pb-2">
              Leave History
            </h3>
            <LeaveHistory leaves={leaves} onStatusChange={handleStatusChange} isAdmin={false} />
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
