// src/services/LeaveService.js
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

// Save new leave — returns docRef for magic link
export const saveLeave = async (leave) => {
  const docRef = await addDoc(collection(db, "leaves"), leave);
  return docRef;
};

export const getLeaveHistory = async (username = null) => {
  let q;
  if (username) {
    q = query(collection(db, "leaves"), where("employeeName", "==", username));
  } else {
    q = collection(db, "leaves");
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateLeaveStatus = async (id, status) => {
  try {
    const leaveRef = doc(db, "leaves", String(id));
    await updateDoc(leaveRef, { status });
  } catch (err) {
    console.error("Update error:", err);
  }
};

export const clearLeaves = async () => {
  const snapshot = await getDocs(collection(db, "leaves"));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "leaves", d.id)));
  await Promise.all(deletePromises);
};
