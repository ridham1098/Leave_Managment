// src/utils/emailService.js
// Uses Vite proxy to avoid CORS — no backend needed!


const HR_EMAIL       = import.meta.env.VITE_HR_EMAIL || 'hr@company.com';
const BASE_URL       = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

export async function sendLeaveRequestEmail(leaveData, token) {
  const reviewLink = `${BASE_URL}/review?token=${token}`;

  const emailHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  body{font-family:'Segoe UI',sans-serif;background:#0d0d0d;margin:0;padding:20px}
  .wrap{max-width:560px;margin:0 auto;background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #3b0000}
  .hdr{background:linear-gradient(135deg,#7f0000,#DC2626);padding:28px 32px;text-align:center}
  .hdr h1{color:white;font-size:20px;font-weight:700;margin:0}
  .hdr p{color:rgba(255,255,255,0.8);font-size:12px;margin-top:6px}
  .body{padding:28px 32px}
  .greeting{font-size:14px;color:#e2e8f0;margin-bottom:16px}
  .card{background:#111;border:1px solid #3b0000;border-radius:12px;padding:18px;margin-bottom:20px}
  .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2a0000}
  .row:last-child{border:none}
  .lbl{font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase}
  .val{font-size:13px;color:#f1f5f9;font-weight:600}
  .reason{background:#1a0a0a;border:1px solid #7f0000;border-radius:8px;padding:14px;margin-bottom:20px;font-size:13px;color:#fca5a5;line-height:1.7}
  .reason-lbl{font-size:10px;font-weight:700;color:#DC2626;text-transform:uppercase;margin-bottom:6px}
  .action-wrap{text-align:center;margin:24px 0}
  .btn{display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#DC2626,#7f0000);color:white;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700}
  .note{background:#1a1a2e;border:1px solid #3b3b8e;border-radius:8px;padding:12px 14px;font-size:12px;color:#818cf8;margin-top:16px;line-height:1.6}
  .link{word-break:break-all;font-size:10px;color:#64748B;margin-top:8px;text-align:center}
  .ftr{background:#111;padding:14px;text-align:center;font-size:11px;color:#475569;border-top:1px solid #1E293B}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>📋 New Leave Request</h1>
    <p>Action required — Please review and respond</p>
  </div>
  <div class="body">
    <div class="greeting">Hello HR Team,</div>
    <p style="font-size:13px;color:#94A3B8;margin-bottom:20px;line-height:1.7">
      <strong style="color:#f1f5f9">${leaveData.employeeName}</strong> has submitted a leave request. Please review and take action using the button below.
    </p>
    <div class="card">
      <div class="row"><span class="lbl">Employee</span><span class="val">${leaveData.employeeName}</span></div>
      <div class="row"><span class="lbl">From Date</span><span class="val">${leaveData.from}</span></div>
      <div class="row"><span class="lbl">To Date</span><span class="val">${leaveData.to}</span></div>
      <div class="row"><span class="lbl">Total Days</span><span class="val">${leaveData.totalDays} day(s)</span></div>
      <div class="row"><span class="lbl">Applied On</span><span class="val">${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span></div>
    </div>
    <div class="reason">
      <div class="reason-lbl">📝 Reason</div>
      ${leaveData.reason}
    </div>
    <div class="action-wrap">
      <p style="font-size:13px;color:#94A3B8;margin-bottom:14px">Click below to review — No login required!</p>
      <a href="${reviewLink}" class="btn">👆 Review & Respond Now</a>
      <div class="note">⏰ Link valid for <strong>72 hours</strong> · One-time use only · No login needed</div>
      <div class="link">Direct link: ${reviewLink}</div>
    </div>
  </div>
  <div class="ftr">Leave Management System · Built by Ridham · Automated email</div>
</div>
</body>
</html>`;

try {
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Leave System <onboarding@resend.dev>',
      to: 'ridhamkoundal04@gmail.com',
      subject: `📋 Leave Request — ${leaveData.employeeName} (${leaveData.totalDays} days)`,
      html: emailHTML,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Email failed');
  }

  return { success: true };
} catch (e) {
  console.error('❌ Email error:', e);
  return { success: false, error: e.message };
}
}
export async function sendStatusEmail(employeeEmail, employeeName, status, leaveData, reason = '') {
  if (!employeeEmail) return;
  const isApproved = status === 'Approved';

  const emailHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
  body{font-family:'Segoe UI',sans-serif;background:#0d0d0d;margin:0;padding:20px}
  .wrap{max-width:500px;margin:0 auto;background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid ${isApproved?'#14532d':'#7f0000'}}
  .hdr{background:${isApproved?'linear-gradient(135deg,#15803d,#16a34a)':'linear-gradient(135deg,#7f0000,#DC2626)'};padding:28px;text-align:center}
  .icon{font-size:40px;margin-bottom:8px}
  .title{color:white;font-size:20px;font-weight:700}
  .body{padding:28px}
  .msg{font-size:14px;color:#94A3B8;line-height:1.7;margin-bottom:20px}
  .card{background:#111;border:1px solid #1E293B;border-radius:10px;padding:16px;margin-bottom:16px}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1E293B;font-size:13px}
  .row:last-child{border:none}
  .lbl{color:#64748B}.val{font-weight:600;color:#f1f5f9}
  .reason-box{background:#1a0a0a;border:1px solid #7f0000;border-radius:8px;padding:12px;font-size:13px;color:#fca5a5;margin-bottom:16px}
  .ftr{background:#111;padding:14px;text-align:center;font-size:11px;color:#475569;border-top:1px solid #1E293B}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="icon">${isApproved?'✅':'❌'}</div>
    <div class="title">Leave ${isApproved?'Approved!':'Rejected'}</div>
  </div>
  <div class="body">
    <div class="msg">Hi <strong style="color:#f1f5f9">${employeeName}</strong>, your leave request has been <strong style="color:${isApproved?'#4ade80':'#f87171'}">${status}</strong> by HR.</div>
    <div class="card">
      <div class="row"><span class="lbl">From</span><span class="val">${leaveData.startDate || leaveData.from}</span></div>
      <div class="row"><span class="lbl">To</span><span class="val">${leaveData.endDate || leaveData.to}</span></div>
      <div class="row"><span class="lbl">Days</span><span class="val">${leaveData.totalDays}</span></div>
      <div class="row"><span class="lbl">Status</span><span class="val" style="color:${isApproved?'#4ade80':'#f87171'}">${status.toUpperCase()}</span></div>
    </div>
    ${!isApproved && reason ? `<div class="reason-box"><strong>Rejection reason:</strong><br/>${reason}</div>` : ''}
  </div>
  <div class="ftr">Leave Management System · Built by Ridham</div>
</div>
</body>
</html>`;
try {
  await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Leave System <onboarding@resend.dev>',
      to: [employeeEmail],
      subject: `Your leave has been ${status} ${isApproved ? '✅' : '❌'}`,
      html: emailHTML,
    }),
  });
} catch (e) {
  console.error('Status email error:', e);
}
}