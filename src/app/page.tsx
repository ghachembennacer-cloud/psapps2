"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Users, Gamepad2, Bell, Search, Settings, Trophy } from "lucide-react";

export default function PSAppPC() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("play");

  useEffect(() => {
    fetch("/api/psn").then(res => res.json()).then(json => {
      setData(json);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1, 0.95] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-500 font-black italic tracking-widest text-xl">PS APP</p>
      </motion.div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container - The "Virtual Mobile" on PC */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[430px] h-[90vh] max-h-[850px] bg-black rounded-[3rem] overflow-hidden relative border border-white/10 ps-blue-glow flex flex-col shadow-2xl"
      >
        {/* Top Status Bar Decor */}
        <div className="h-8 w-full flex justify-center items-end pb-1">
          <div className="w-24 h-5 bg-zinc-900 rounded-full" />
        </div>

        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl z-20">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Play</h1>
          <div className="flex gap-4">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Bell className="text-zinc-400" size={22} /></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Settings className="text-zinc-400" size={22} /></motion.button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-28">
          {/* User Status Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mt-4 mb-8 p-6 rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-800 to-black border border-white/10 flex items-center gap-4 relative overflow-hidden"
          >
            <div className="relative z-10">
              <img src={data?.friends?.[0]?.avatarUrl || "https://avatar-res.api.playstation.com/avatar/default/DefaultAvatar.png"} className="w-16 h-16 rounded-full border-2 border-white shadow-lg" alt="" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-800" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold tracking-tight">PlayStation Player</h2>
              <div className="flex items-center gap-2 mt-1 opacity-80">
                <Trophy size={14} className="text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Level 240</span>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </motion.div>

          {/* Friends Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold">Friends</h3>
              <span className="text-xs text-blue-500 font-bold uppercase tracking-widest">View All</span>
            </div>
            <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
              {data?.friends?.map((f: any, i: number) => (
                <motion.div
                  key={f.accountId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="relative group cursor-pointer">
                    <motion.img
                      whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                      src={f.avatarUrl}
                      className="w-16 h-16 rounded-full border-2 border-zinc-800 transition-colors p-0.5"
                    />
                    <div className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-black ${f.onlineStatus === 'online' ? 'bg-green-500' : 'bg-zinc-500'}`} />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 w-16 truncate text-center uppercase tracking-tighter">{f.onlineId}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recently Played */}
          <section>
            <h3 className="text-lg font-bold mb-5">Played Recently</h3>
            <div className="grid grid-cols-2 gap-4">
              {data?.games?.slice(0, 6).map((g: any, i: number) => (
                <motion.div
                  key={g.npCommunicationId}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.05) }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-blue-500/50 transition-all shadow-xl">
                    <img src={g.trophyTitleIconUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <p className="text-[11px] font-bold truncate px-1 uppercase tracking-tight text-zinc-300">{g.trophyTitleName}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Navigation Bar */}
        <nav className="absolute bottom-6 left-6 right-6 h-20 bg-zinc-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 flex justify-around items-center px-4 z-30 shadow-2xl">
          <NavItem icon={<Gamepad2 size={24} />} active={activeTab === 'play'} onClick={() => setActiveTab('play')} />
          <NavItem icon={<Search size={24} />} active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          <NavItem icon={<Users size={24} />} active={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
          <NavItem icon={<MessageCircle size={24} />} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        </nav>
      </motion.div>
    </div>
  );
}

function NavItem({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className="relative p-3 group">
      <div className={`transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        {icon}
      </div>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-blue-500/10 rounded-full blur-md"
        />
      )}
    </button>
  );
}