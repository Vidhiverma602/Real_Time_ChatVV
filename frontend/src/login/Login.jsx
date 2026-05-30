import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({ ...userInput, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", userInput);
      const data = response.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      toast.success(data.message || "Logged in successfully");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/95 px-4 py-10 text-white">
      <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Welcome back</p>
          <h1 className="text-4xl font-semibold text-white">Login to ChatVV</h1>
          <p className="text-slate-300">Enter your credentials to continue chatting instantly.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-200">Email</label>
          <input
            id="email"
            type="email"
            onChange={handleInput}
            placeholder="you@example.com"
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
          />

          <label className="block text-sm font-semibold text-slate-200">Password</label>
          <input
            id="password"
            type="password"
            onChange={handleInput}
            placeholder="••••••••"
            required
            className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
          />

          <button
            type="submit"
            className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-400"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-300">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-white underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
