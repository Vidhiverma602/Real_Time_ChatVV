import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    setUserInput({ ...userInput, [e.target.id]: e.target.value });
  };
  console.log(userInput);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`/api/auth/login`, userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        return console.log(data.message);
      }
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login
          <span>ChatVV</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col ">
          <div>
            <label className="font-bold text-gray-950 text-xl lable-text">
              Email :
            </label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="fond-bold text-gray-950 text-xl lable-text">
              Password :
            </label>
            <input
              id="password"
              type="Password"
              onChange={handleInput}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg text-white rounded-lg hover: scale-105"
            type="submit"
          >
            {loading ? "loading.." : "login"}
          </button>
        </form>

        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an account?{" "}
            <Link to={"/register"}>
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Register Now!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
