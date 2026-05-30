import React, { useState, useEffect, useRef } from "react";
import userConversation from "../../Zustans/useConversation";
import { useAuth } from "../../context/AuthContext";
import { RiMessageFill } from "react-icons/ri";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { useSocketContext } from "../../context/socketContext";
import api from "../../services/api";
import notify from "../../assets/sound/notification.mp3";
import { toast } from "react-toastify";

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage } = userConversation();
  const { authUser } = useAuth();
  const { socket } = useSocketContext();
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessage]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;
      setLoading(true);
      try {
        const response = await api.get(`/api/message/${selectedConversation._id}`);
        const data = response.data;
        setLoading(false);
        if (data.success === false) {
          toast.error(data.message || "Failed to fetch messages");
          return;
        }
        setMessage(data.messages || data || []);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getMessages();
  }, [selectedConversation?._id, setMessage]);

  const handelMessages = (e) => {
    setSendData(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;
    setSending(true);
    try {
      const response = await api.post(`/api/message/send/${selectedConversation?._id}`, {
        message: sendData,
      });
      const data = response.data;
      setSending(false);
      if (data.success === false) {
        toast.error(data.message || "Message failed to send");
        return;
      }
      setSendData("");
      setMessage((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      {selectedConversation === null ? (
        <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-slate-200/10 bg-slate-100/80 p-8 text-center text-slate-950 shadow-xl">
          <RiMessageFill className="mb-4 text-6xl text-sky-600" />
          <h2 className="text-3xl font-semibold">Welcome, {authUser?.username || "Guest"}!</h2>
          <p className="mt-3 max-w-xl text-slate-600">Select a chat on the left or search users to start a conversation.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 rounded-3xl bg-sky-600/15 p-4 text-slate-950 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={selectedConversation?.profilepic}
                  alt={selectedConversation?.username}
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Chat with</p>
                <p className="text-lg font-semibold">{selectedConversation?.username}</p>
              </div>
            </div>
            <button
              onClick={() => onBackUser(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/30 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              <IoArrowBackSharp size={18} />
              Back
            </button>
          </div>

          <div className="flex min-h-[56vh] flex-col rounded-[2rem] border border-slate-200/10 bg-slate-950 p-4 shadow-xl">
            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-400/40 border-t-sky-500" />
                </div>
              ) : messages?.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center text-slate-300">
                  <p className="text-xl font-semibold text-white">No messages yet</p>
                  <p>Send the first message to start the conversation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id || `${message.senderId}-${message.createdAt}`}
                      ref={lastMessageRef}
                      className={`flex items-end gap-3 ${
                        message.senderId === authUser._id ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.senderId !== authUser._id && (
                        <img
                          src={selectedConversation.profilepic}
                          alt="sender"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div className={`max-w-[70%] rounded-3xl px-4 py-3 text-sm ${
                        message.senderId === authUser._id
                          ? "bg-sky-500 text-white"
                          : "bg-slate-800 text-slate-100"
                      }`}>
                        {message.message}
                        <div className="mt-2 text-[10px] opacity-60">
                          {new Date(message?.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.senderId === authUser._id && (
                        <img
                          src={authUser.profilepic}
                          alt="me"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handelSubmit} className="mt-4 flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3 shadow-inner">
              <input
                value={sendData}
                onChange={handelMessages}
                required
                id="message"
                type="text"
                placeholder="Type your message..."
                className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-500"
                disabled={sending}
              >
                {sending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : <IoSend size={20} />}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
