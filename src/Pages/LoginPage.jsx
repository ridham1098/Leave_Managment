
// src/Pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/ChatGPT Image Apr 21, 2026, 11_20_03 PM.png";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const ADMIN_EMAIL = "admin@leave.com";

// Admin ka email/password Firebase Authentication mein set karna hoga
const ADMIN_EMAIL = "admin@leave.com"; // apna admin email daalo

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // User Login

  const handleUserLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password!");
      return;
    }
    setLoading(true);
    try {

      const email = `${username.trim()}@leave.com`;
      await signInWithEmailAndPassword(auth, email, password);
      // Save both user and email to localStorage for magic link
      localStorage.setItem("user",  username.trim());
      localStorage.setItem("email", `${username.trim()}@leave.com`);

      // username ko email format mein convert karo
      const email = `${username.trim()}@leave.com`;
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", username.trim());

      toast.success(`Welcome, ${username}!`);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error("Invalid username or password!");
    }
    setLoading(false);
  };


  // Admin Login

  const handleAdminLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password!");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      localStorage.setItem("admin", "true");
      toast.success("Admin Login Successful!");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      toast.error("Invalid admin credentials!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-[#3b0000] to-red-700">

      <motion.div initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }} viewport={{ once: true }} className="w-full max-w-lg">

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-lg"
      >

        <div className="flex justify-center mb-6">
          <img src={Logo} alt="logo" className="w-24 h-24 rounded-3xl bg-white p-2 shadow-2xl border border-white/30 hover:scale-105 transition duration-300" />
        </div>
        <h1 className="text-4xl font-bold text-center text-white mb-3">
          Leave Management System | Built by Ridham
        </h1>
        <p className="text-center text-gray-300 mb-8">Please login to continue</p>

        <form onSubmit={handleUserLogin} className="bg-white/10 backdrop-blur-xl border border-red-400/30 rounded-2xl p-8 shadow-2xl space-y-5">
          <h2 className="text-5xl font-bold text-center text-white mb-6">Login</h2>

          <div>
            <label className="text-sm text-gray-200">Username</label>
            <input type="text" placeholder="Enter username" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-black/40 border border-red-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="text-sm text-gray-200">Password</label>
            <input type="password" placeholder="Enter password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-black/40 border border-red-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-300">
            {loading ? "Logging in..." : "Login"}
          </button>

          <button type="button" onClick={handleAdminLogin} disabled={loading}
            className="w-full py-3 rounded-lg border border-red-500 text-white hover:bg-red-600 transition duration-300">
            {loading ? "Please wait..." : "Admin Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
