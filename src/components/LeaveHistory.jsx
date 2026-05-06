import React from 'react';

// LeaveHistory - displays all leaves in a table

function LeaveHistory({ leaves, onStatusChange, isAdmin }) {
  if (!leaves.length) {      //If the leaves array is empty show error
    return <p className="text-gray-300 mt-4">No leaves applied yet.</p>;
  }

  return (
    <div className="mt-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 hover:shadow-blue-400/40 hover:scale-105">
      {/* heading */}
      <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-lg shadow-pink-500/60 hover:shadow-blue-400/80 transition-all duration-300 mb-6 flex items-center gap-2">
        Leave Records
      </h3>
      <div className='overflow-x-auto rounded-xl border border-white/10'>
      {/* table */}
        <table className="min-w-full text-gray-100 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 text-sm">
          {/* table headings */}
          <thead className="bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Employee Name</th>
              <th className="px-4 py-2 text-left font-semibold">From Date</th>
              <th className="px-4 py-2 text-left font-semibold">To Date</th>
              <th className="px-4 py-2 text-left font-semibold">Reason</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              {/* actions if admin */}
              {isAdmin && <th className="px-4 py-2 text-center font-semibold">Actions</th>}
            </tr>
          </thead>

          {/* adding table data */}
          <tbody>
            {leaves.map((leave, index) => (
              //leave represents one leave record { id, employeeName, from, to, reason, status }
              <tr key={leave.id} className={`${index % 2 === 0 ? "bg-white/10" : "bg-white/5"} hover:bg-white/20 transition-all duration-200`}>
                <td className="px-4 py-2 font-medium text-gray-200">{leave.employeeName || '—'}</td>
                <td className="px-4 py-2">{leave.from}</td>
                <td className="px-4 py-2">{leave.to}</td>
                <td className="px-4 py-2">{leave.reason}</td>
                <td className={`px-4 py-2 font-semibold ${leave.status === "Approved" ? "text-green-400" : leave.status === "Rejected" ? "text-red-400" : "text-yellow-400"}`}>{leave.status}</td>
              {/* approve and reject section if admin */}
                {isAdmin && ( 
                  <td className="px-4 py-2 text-center space-x-3"> 
                    {leave.status === "Pending" ? (           // showing accept and reject button only if status is pending
                      <div className='flex gap-1 md:flex-row flex-col'>
                        <button
                          onClick={() => onStatusChange(leave.id, 'Approved')}
                          className="px-4 py-1 w-[100px] rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 transition-all text-white shadow-md hover:shadow-green-400/50 cursor-pointer">
                          Approve
                        </button>
                        <button
                          onClick={() => onStatusChange(leave.id, 'Rejected')}
                          className="px-4 py-1 w-[100px] rounded-lg text-sm font-medium bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 transition-all text-white shadow-md hover:shadow-red-400/50 cursor-pointer">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className='px-3 py-1 rounded-full text-white text-sm font-semibold'>{leave.status}</span> // if status is not pending . actual status would be shown
                    )}

                  </td>
                )

                }

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveHistory