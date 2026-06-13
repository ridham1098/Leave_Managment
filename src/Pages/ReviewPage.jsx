// src/Pages/ReviewPage.jsx
// HR opens this page via magic link email — NO LOGIN NEEDED!
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { validateToken, markTokenUsed } from '../utils/magicLink';
import { sendStatusEmail } from '../utils/emailService';
import { motion } from 'framer-motion';

export default function ReviewPage() {
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');
  const [state, setState]       = useState('loading');
  const [leaveData, setLeaveData]       = useState(null);
  const [action, setAction]             = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');

  useEffect(() => {
    if (!token) { setState('invalid'); return; }

    validateToken(token).then(({ valid, error, data }) => {
      if (!valid) {
        if (error && error.includes('already been used')) setState('used');
        else if (error && error.includes('expired'))      setState('expired');
        else                                              setState('invalid');
      } else {
        // ── Normalize field names ──────────────────────
        // magicLink.js saves startDate/endDate OR from/to
        // Handle both cases
        const normalized = {
          ...data,
          leaveId:      data.leaveId      || data.id || '',
          employeeName: data.employeeName || 'Employee',
          employeeEmail:data.employeeEmail|| '',
          startDate:    data.startDate    || data.from || '',
          endDate:      data.endDate      || data.to   || '',
          totalDays:    data.totalDays    || 0,
          reason:       data.reason       || '',
        };
        setLeaveData(normalized);
        setState('valid');
      }
    }).catch(() => setState('invalid'));
  }, [token]);

  // ── Handle Approve / Reject ────────────────────────
  const handleAction = async (type) => {
    setErrorMsg('');

    // Validate rejection reason
    if (type === 'Rejected' && !rejectReason.trim()) {
      setErrorMsg('Please enter a reason for rejection!');
      return;
    }

    // Validate leaveId exists
    if (!leaveData?.leaveId) {
      setErrorMsg('Invalid leave data. Please contact the employee to resend the request.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Check if leave document exists
      const leaveRef  = doc(db, 'leaves', leaveData.leaveId);
      const leaveSnap = await getDoc(leaveRef);

      if (!leaveSnap.exists()) {
        setErrorMsg('Leave document not found in database. Please contact admin.');
        setSubmitting(false);
        return;
      }

      // 2. Update leave status in Firestore
      await updateDoc(leaveRef, {
        status:          type,
        rejectionReason: type === 'Rejected' ? rejectReason.trim() : '',
        reviewedAt:      serverTimestamp(),
        reviewedVia:     'magic-link',
      });

      // 3. Mark token as used (one-time use)
      await markTokenUsed(token, type, rejectReason.trim());

      // 4. Send status email to employee
      if (leaveData.employeeEmail) {
        try {
          await sendStatusEmail(
            leaveData.employeeEmail,
            leaveData.employeeName,
            type,
            leaveData,
            rejectReason.trim()
          );
        } catch (emailErr) {
          // Email fail hone pe bhi proceed karo
          console.warn('Status email failed:', emailErr);
        }
      }

      setAction(type);
      setState('done');

    } catch (e) {
      console.error('handleAction error:', e);
      setErrorMsg('Something went wrong: ' + e.message);
    }

    setSubmitting(false);
  };

  // ── Loading ────────────────────────────────────────
  if (state === 'loading') return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#3b0000] to-red-700 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70 text-sm">Verifying your link...</p>
      </div>
    </div>
  );

  // ── Invalid / Expired / Used ───────────────────────
  if (state !== 'valid' && state !== 'done') {
    const msgs = {
      invalid: { icon: '🔗', title: 'Invalid Link',     sub: 'This link is not valid. Please contact the employee to resend the request.' },
      expired: { icon: '⏰', title: 'Link Expired',     sub: 'This link has expired (72 hours). Please ask the employee to submit a new leave request.' },
      used:    { icon: '✅', title: 'Already Reviewed', sub: 'This leave request has already been reviewed. No further action needed.' },
    };
    const m = msgs[state] || msgs.invalid;
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#3b0000] to-red-700 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 text-center max-w-md w-full"
        >
          <div className="text-5xl mb-4">{m.icon}</div>
          <h2 className="text-2xl font-bold text-white mb-3">{m.title}</h2>
          <p className="text-gray-300 text-sm leading-7">{m.sub}</p>
        </motion.div>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────
  if (state === 'done') return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#3b0000] to-red-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white/10 backdrop-blur-lg border ${
          action === 'Approved' ? 'border-green-500/40' : 'border-red-500/40'
        } rounded-2xl p-10 text-center max-w-md w-full`}
      >
        <div className="text-6xl mb-4">{action === 'Approved' ? '✅' : '❌'}</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Leave {action === 'Approved' ? 'Approved!' : 'Rejected!'}
        </h2>
        <p className="text-gray-300 text-sm leading-7">
          <strong className="text-white">{leaveData?.employeeName}</strong>'s leave has been{' '}
          <strong className={action === 'Approved' ? 'text-green-400' : 'text-red-400'}>
            {action}
          </strong>.
          {leaveData?.employeeEmail ? ' They have been notified via email.' : ''}
        </p>
        {action === 'Rejected' && rejectReason && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-300 text-xs">
              <strong>Rejection Reason:</strong> {rejectReason}
            </p>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-6">You can close this tab now 👋</p>
      </motion.div>
    </div>
  );

  // ── Main Review Page ───────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#3b0000] to-red-700 p-4 md:p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            📋 Leave Review Request
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Review Leave Application</h1>
          <p className="text-gray-400 text-sm">No login required · Secure one-time link</p>
        </div>

        {/* Employee Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {leaveData?.employeeName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-lg">{leaveData?.employeeName}</div>
              <div className="text-gray-400 text-sm">{leaveData?.employeeEmail || 'Employee'}</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold px-3 py-1 rounded-full">
              LEAVE REQUEST
            </div>
          </div>
        </div>

        {/* Leave Details */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-4">
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">📅 Leave Details</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'From Date',  value: leaveData?.startDate || leaveData?.from || '-' },
              { label: 'To Date',    value: leaveData?.endDate   || leaveData?.to   || '-' },
              { label: 'Total Days', value: `${leaveData?.totalDays || 0} day(s)` },
              { label: 'Status',     value: 'Pending Review' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">{item.label}</div>
                <div className="text-white font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-4">
          <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">📝 Reason for Leave</h3>
          <div className="bg-black/30 border-l-4 border-red-500 rounded-lg p-4 text-gray-200 text-sm leading-7">
            {leaveData?.reason || 'No reason provided'}
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-4">
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">⚡ Take Action</h3>

          {/* Approve / Reject buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => { setAction('Approved'); setRejectReason(''); setErrorMsg(''); }}
              className={`py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer ${
                action === 'Approved'
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'border-white/20 text-white/70 hover:border-green-500/50 hover:text-green-400'
              }`}
            >
              ✅ Approve Leave
            </button>
            <button
              onClick={() => { setAction('Rejected'); setErrorMsg(''); }}
              className={`py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 cursor-pointer ${
                action === 'Rejected'
                  ? 'bg-red-500/20 border-red-500 text-red-400'
                  : 'border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-400'
              }`}
            >
              ❌ Reject Leave
            </button>
          </div>

          {/* Rejection reason textarea */}
          {action === 'Rejected' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <label className="text-gray-300 text-sm font-medium block mb-2">
                Reason for Rejection <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full bg-black/40 border border-red-500/40 text-white rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none placeholder-gray-500"
                placeholder="e.g. Insufficient leave balance / Project deadline..."
                rows={3}
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </motion.div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">⚠️ {errorMsg}</p>
            </div>
          )}

          {/* Submit button */}
          {action && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleAction(action)}
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-300 cursor-pointer ${
                action === 'Approved'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/30'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg hover:shadow-red-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : action === 'Approved' ? (
                '✅ Confirm Approval'
              ) : (
                '❌ Confirm Rejection'
              )}
            </motion.button>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs pb-6">
          🔒 Secure one-time link · Leave Management System · Built by Ridham
        </p>
      </motion.div>
    </div>
  );
}