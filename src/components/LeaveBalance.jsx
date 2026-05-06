// Props change: ab setLeaves ki jagah sirf leaves aayegi directly
import React, { useMemo } from 'react';

function LeaveBalance({ leaves, MAX_LEAVES }) {
  const approvedDays = useMemo(() => {
    return (leaves || []).reduce((total, leave) => {
      if (leave.status === "Approved") {
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        return total + ((to - from) / (1000 * 60 * 60 * 24) + 1);
      }
      return total;
    }, 0);
  }, [leaves]);

  const leaveBalance = Math.max(MAX_LEAVES - approvedDays, 0);

  return (
    <div>
      <div className={`bg-white/10 backdrop-blur-md border ${leaveBalance === 0 ? 'border-red-500/60 shadow-red-400/40' : 'border-white/20 hover:shadow-blue-400/40'} rounded-xl p-4 text-center shadow-md w-fit mx-auto mb-6 hover:scale-105 transition-all`}>
        <p className={`text-lg font-medium mb-3 ${leaveBalance === 0 ? 'text-red-300' : 'text-blue-100'}`}>
          Leave Balance: <span className={`font-bold ${leaveBalance === 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{leaveBalance} days</span>
        </p>
        <div className="w-64 bg-white/20 rounded-full h-3 overflow-hidden mx-auto shadow-inner border border-white/10">
          <div className={`h-full rounded-full transition-all duration-700 ${leaveBalance === 0 ? 'bg-red-600' : leaveBalance >= 7 ? 'bg-green-400' : leaveBalance >= 4 ? 'bg-yellow-400' : 'bg-orange-500'}`}
            style={{ width: `${(approvedDays / MAX_LEAVES) * 100}%` }} />
        </div>
        <p className="text-sm text-gray-300 mt-2">
          Used: <span className={`font-semibold ${leaveBalance === 0 ? 'text-red-400' : 'text-white'}`}>{approvedDays}</span> / {MAX_LEAVES} days
        </p>
        {leaveBalance === 0 && (
          <p className="text-red-400 text-sm font-semibold mt-3">You have used all your available leaves!</p>
        )}
      </div>
    </div>
  );
}

export default LeaveBalance;