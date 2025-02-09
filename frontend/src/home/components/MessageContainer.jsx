import React, { useState, useEffect, useRef } from "react";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { RiMessageFill } from "react-icons/ri";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/socketContext";
import notify from'../../assets/sound/notification.mp3'

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    selectedConversation,
    setMessage,
    setSelectedConversation,
  } = userConversation();
  const { authUser } = useAuth();
  const {socket} = useSocketContext();
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();


      useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
          const sound = new Audio(notify);
          sound.play();
          setMessage([...messages, newMessage]);
        });

        return () => socket?.off("newMessage");
      }, [socket, setMessage, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);

      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
          console.log("Fetched Messages Data:", data);
        }
        setLoading(false);
        setMessage(data.messages || data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);
  console.log(messages);

  const handelMessages = (e) => {
    setSendData(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessage([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="px-4 text-center text-2xl text-gray-950 font-semibold 
            flex flex-col items-center gap-2"
          >
            <p className="text-2xl">Welcome!!👋 {authUser.username}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <RiMessageFill className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white rounded-full px-2 py-1
                   self-center"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img
                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                    src={selectedConversation?.profilepic}
                  />
                </div>
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>
          {/* <div className="flex-1 overflow-auto">
              {loading && (
                <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
              {!loading && messages?.length === 0 && (
                <p className="text-center text-white items-center">
                  send mess otherwise i kill you
                </p>
              )}
              {!loading &&
                messages?.length > 0 &&
                messages?.map((message) => (
                  <div
                    key={message?._id}
                    className={`chat ${
                      message.senderId === authUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar"></div>
                    <div
                      className={`chat-bubble ${
                        message.senderId === authUser._id
                          ? "bg-sky-600"
                          : "bg-gray-700"
                      } text-white`}
                    >
                      {message?.message}
                    </div>
                  </div>
                ))}
            </div> */}

          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center text-black items-center">
                No messages yet. Start the conversation!
              </p>
            )}
            {!loading &&
              messages?.length > 0 &&
              messages.map((message) => (
                <div
                  className="text-white"
                  key={message?._id}
                  ref={lastMessageRef}
                >
                  <div
                    key={message._id} // Ensure each message has a unique key
                    className={`flex items-end gap-2 ${
                      message.senderId === authUser._id
                        ? "justify-end" // Align to the right for the current user
                        : "justify-start" // Align to the left for other users
                    }`}
                  >
                    {/* Profile Image */}
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilepic // Current user's profile picture
                          : selectedConversation.profilepic // Other user's profile picture
                      }
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-xs px-4 py-2 text-white rounded-lg ${
                        message.senderId === authUser._id
                          ? "bg-sky-600 self-end" // Current user's bubble style
                          : "bg-gray-700 self-start" // Other user's bubble style
                      }`}
                    >
                      {message?.message}
                    </div>
                    <div className="chat-footer text-[10px] opacity-80">
                      {/* {new Date(message?.createdAt).toLocaleDateString("en-IN")} */}
                      {new Date(message?.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <form onSubmit={handelSubmit} className="rounded-full text-black">
            <div className="w-full rounded-full flex items-center bg-white">
              <input
                value={sendData}
                onChange={handelMessages}
                required
                id="message"
                type="text"
                className="w-full bg-transparent outline-none px-4 rounded-full"
              />
              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner"></div>
                ) : (
                  <IoSend
                    size={25}
                    className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
