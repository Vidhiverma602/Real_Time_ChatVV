import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import MessageContainer from "./components/MessageContainer";
const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950/95 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:flex md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">ChatVV</p>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Real-time chat that feels polished.</h1>
            <p className="max-w-2xl text-slate-300">Keep conversations flowing with modern messaging UX and a scalable frontend structure.</p>
          </div>
          {selectedUser && (
            <button
              onClick={handleShowSidebar}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 md:mt-0"
            >
              Back to chats
            </button>
          )}
        </header>

        <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className={`rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl transition-all ${isSidebarVisible ? "block" : "hidden md:block"}`}>
            <Sidebar onSelectUser={handleUserSelect} />
          </aside>
          <main className="rounded-[2rem] border border-white/10 bg-white/90 p-4 shadow-2xl backdrop-blur-xl text-slate-950">
            <MessageContainer onBackUser={handleShowSidebar} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
