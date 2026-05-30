import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (gender) => {
    setInputData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }
    if (!inputData.gender) {
      setLoading(false);
      return toast.error("Please select your gender");
    }
    try {
      const response = await api.post("/api/auth/register", inputData);
      const data = response.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message || "Registration failed");
        return;
      }
      toast.success(data?.message || "Account created successfully");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/95 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Create account</p>
          <h1 className="text-4xl font-semibold text-white">Join ChatVV</h1>
          <p className="text-slate-300">Sign up and start messaging instantly with a clean chat experience.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-200">Full Name</label>
            <input
              id="fullname"
              type="text"
              onChange={handleInput}
              placeholder="Enter your full name"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-200">Username</label>
            <input
              id="username"
              type="text"
              onChange={handleInput}
              placeholder="Choose a username"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-200">Email</label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="you@example.com"
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2 md:gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-200">Password</label>
              <input
                id="password"
                type="password"
                onChange={handleInput}
                placeholder="Create a password"
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-200">Confirm Password</label>
              <input
                id="confpassword"
                type="password"
                onChange={handleInput}
                placeholder="Confirm your password"
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {['male', 'female'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => selectGender(gender)}
                className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                  inputData.gender === gender
                    ? 'border-sky-400 bg-sky-500 text-white'
                    : 'border-slate-700 text-slate-200 hover:border-sky-400 hover:text-white'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-400"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-white underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
