// src/utils/magicLink.js
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

// Generate secure random token
export function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Save token to Firestore with 72hr expiry
export async function createMagicToken(leaveId, leaveData) {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 72);

  await setDoc(doc(db, 'magicTokens', token), {
    leaveId,
    employeeName:  leaveData.employeeName,
    employeeEmail: leaveData.employeeEmail || '',
    startDate:     leaveData.from,
    endDate:       leaveData.to,
    totalDays:     leaveData.totalDays,
    reason:        leaveData.reason,
    used:          false,
    createdAt:     serverTimestamp(),
    expiresAt:     expiresAt.toISOString(),
  });

  return token;
}

// Validate token when HR opens review page
export async function validateToken(token) {
  try {
    const tokenDoc = await getDoc(doc(db, 'magicTokens', token));
    if (!tokenDoc.exists()) return { valid: false, error: 'Invalid link' };

    const data = tokenDoc.data();
    if (data.used) return { valid: false, error: 'already been used' };

    const now     = new Date();
    const expires = new Date(data.expiresAt);
    if (now > expires) return { valid: false, error: 'expired' };

    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'Invalid link' };
  }
}

// Mark token as used after HR takes action
export async function markTokenUsed(token, action, rejectionReason = '') {
  await updateDoc(doc(db, 'magicTokens', token), {
    used:            true,
    usedAt:          serverTimestamp(),
    action,
    rejectionReason,
  });
}
