import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiArrowLeftCircle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import userConversation from "../../Zustans/useConversation";



const sidebar = ({ onSelectUser }) => {


  
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSetSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const {messages, selectedConversation, setSelectedConversation} =
    userConversation()
  // const talkedwith = chatUser.map((user) => user._id);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  // const handelSearchSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const search = await axios.get(`/api/user/search?search=${searchInput}`);
  //     const data = search.data;
  //     if (data.success === false) {
  //       setLoading(false);
  //       console.log(data.message);
  //     }
  //     setLoading(false);
  //     if (data.loading === 0) {
  //       toast.info("User Not Found");
  //     } else {
  //       setSearchuser(data);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //   }
  // };

  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;

      // If your API returns a success flag, handle it here:
      if (data.success === false) {
        setLoading(false);
        toast.info(data.message || "User Not Found");
        return; // Exit early if unsuccessful
      }

      setLoading(false);

      // Assuming data is an array of users:
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handelUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSetSelectedUserId(user._id);
  };

  const handelSearchback = () => {
    setSearchuser([]);
    setSearchInput("");
  };

  const handelLogOut = async () => {
    const confirmlogout = window.prompt("type 'UserName' to logout");
    if (confirmlogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post(`/api/auth/logout`);
        const data = logout.data;
        if (data?.success === false) {
          setLoading(false);
          console.log(data?.message);
        }
        toast.info(data?.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  console.log(chatUser);
  return (
    <div className="h-full w-auto px-1">
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handelSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full "
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-4 w-auto bg-transparent outline-none rounded-full"
            placeholder="search user"
          />

          {/* <button className="btn btn-circle bg-sky-700 hover:bg-gray-950">
            <FaSearch />
          </button> */}

          <button className="w-12 h-12 bg-sky-700 hover:bg-gray-950 rounded-full flex justify-center items-center">
            <FaSearch className="text-white" />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
        />
      </div>
      <div className="divider px-3"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  {/* <div
                    onClick={() => handelUserClick(user)}
                    className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${
                                                  setSetSelectedUserId ===
                                                  user._id
                                                    ? "bg-sky-500"
                                                    : ""
                                                } `}
                  > */}

                  <div
                    onClick={() => handelUserClick(user)}
                    className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${
                                                  selectedUserId === user?._id
                                                    ? "bg-sky-500"
                                                    : ""
                                                } `}
                  >
                    <div className="flex items-center p-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={user.profilepic}
                          alt="user"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-950">{user.username}</p>
                    </div>
                  </div>
                  <hr className="border-t border-gray-300 my-2" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 flex">
            <button
              onClick={handelSearchback}
              className="bg-white rounded-full px-2 py-1 self-center"
            >
              <FiArrowLeftCircle size={30} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Why are you Alone!!🤔</h1>
                    <h1>Search username to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full p-4">
                    {chatUser.map((user, index) => (





                      <div key={user._id}>
                        <div
                          onClick={() => handelUserClick(user)}
                          className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${
                                                  selectedUserId === user?._id
                                                    ? "bg-sky-500"
                                                    : ""
                                                } `}
                        >
                          <div className="flex items-center p-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img
                                src={user.profilepic}
                                alt="user"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="font-bold text-gray-950">
                              {user.username}
                            </p>
                          </div>
                        </div>
                        <hr className="border-t border-gray-300 my-2" />
                      </div>
                    ))}






                    
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handelLogOut}
              className="flex items-center gap-2 hover:bg-red-600 px-3 py-2 cursor-pointer hover:text-white rounded-lg"
            >
              <SlLogout size={30} />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default sidebar;
