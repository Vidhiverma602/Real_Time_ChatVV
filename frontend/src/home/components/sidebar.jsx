import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../Zustans/useConversation";
import api from "../../services/api";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { setSelectedConversation } = userConversation();

  useEffect(() => {
    const fetchChatUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/user/currentchatters");
        const data = response.data;
        setLoading(false);
        if (data.success === false) {
          toast.error(data.message || "Unable to load chats");
          return;
        }
        setChatUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchChatUsers();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/user/search?search=${searchInput}`);
      const data = response.data;
      setLoading(false);
      if (data.success === false || !Array.isArray(data) || data.length === 0) {
        setSearchResults([]);
        toast.info(data.message || "User not found");
        return;
      }
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Search failed");
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchInput("");
  };

  const handleLogout = async () => {
    const confirmation = window.prompt("Type your username to logout");
    if (confirmation !== authUser?.username) return;
    setLoading(true);
    try {
      const response = await api.post("/api/auth/logout");
      const data = response.data;
      setLoading(false);
      if (data?.success === false) {
        toast.error(data.message || "Logout failed");
        return;
      }
      toast.info(data?.message || "Logged out successfully");
      localStorage.removeItem("chatapp");
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const visibleUsers = searchResults.length > 0 ? searchResults : chatUsers;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Hello</p>
            <h2 className="text-xl font-semibold text-white">{authUser?.fullname || "Guest"}</h2>
          </div>
          <img
            onClick={() => navigate(`/profile/${authUser?._id}`)}
            src={authUser?.profilepic}
            alt="profile"
            className="h-14 w-14 rounded-full border border-white/10 object-cover shadow-lg cursor-pointer"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 p-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search users"
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button
            onClick={handleSearchSubmit}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white transition hover:bg-sky-400"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-xl backdrop-blur-xl">
        <div className="max-h-[62vh] overflow-y-auto px-3 py-4">
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center text-slate-300">Loading chats…</div>
          ) : visibleUsers.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-center text-slate-300">
              <p className="text-lg font-semibold text-white">No chats yet</p>
              <p>Search for someone to start a conversation.</p>
            </div>
          ) : (
            visibleUsers.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleUserClick(user)}
                className={`mb-3 flex w-full items-center gap-3 rounded-3xl border p-3 text-left transition ${
                  selectedUserId === user._id
                    ? "border-sky-400 bg-sky-500/20 text-white"
                    : "border-white/10 bg-slate-950/80 text-slate-100 hover:border-sky-400 hover:bg-slate-900/80"
                }`}
              >
                <img
                  src={user.profilepic}
                  alt={user.username}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="truncate">
                  <p className="font-semibold truncate">{user.username}</p>
                  <p className="text-sm text-slate-400 truncate">{user.email || "Chat user"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
      >
        <SlLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
