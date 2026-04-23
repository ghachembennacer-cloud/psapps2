"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Users, Gamepad2, Bell, Settings, Trophy, Info } from "lucide-react";

export default function PSAppPC() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("play");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/psn");
        const json = await res.json();
        if (json.error) throw new Error(json.message);
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to sync with PSN");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Button Clicks safely
  const handleTabChange = (tab: string) => {
    console.log("Navigating to:", tab);
    setActiveTab(tab);
  };

  if (loading) return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-500 font-bold tracking-widest text-sm uppercase">Synchronizing...</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 text-center">
      <Info className="text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold mb-2 uppercase italic">Connection Error</h2>
      <p className="text-zinc-500 max-w-xs text-sm mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-blue-600 px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-blue-500 transition-colors">Try Again</button>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden p-0 md:p-8">
      {/* Mobile-Style Container on PC */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[430px] h-full md:h-[90vh] bg-black rounded-none md:rounded-[3rem] overflow-hidden relative border-x border-y border-white/10 flex flex-col shadow-[0_0_50px_-12px_rgba(0,67,156,0.4)]"
      >
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-center bg-black/60 backdrop-blur-xl z-20 border-b border-white/5">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Play</h1>
          <div className="flex gap-4">
            <Bell className="text-zinc-400 cursor-pointer hover:text-white transition-colors" size={22} />
            <Settings className="text-zinc-400 cursor-pointer hover:text-white transition-colors" size={22} />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-32">
          {activeTab === "play" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Profile Card */}
              <div className="mt-6 mb-8 p-6 rounded-3xl bg-gradient-to-br from-blue-700 to-black border border-white/10 flex items-center gap-4 shadow-lg">
                <img src={data?.friends?.[0]?.avatarUrl || ""} className="w-14 h-14 rounded-full border-2 border-white" alt="" />
                <div>
                  <h2 className="font-bold text-lg leading-none">PlayStation User</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Trophy size={12} className="text-yellow-500" />
                    <span className="text-[10px] font-bold uppercase text-white/60">Trophy Level 24</span>
                  </div>
                </div>
              </div>

              {/* Friends List */}
              <h3 className="font-bold mb-4 px-1 uppercase text-xs tracking-widest text-zinc-500">Online Friends</h3>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                {data?.friends?.map((f: any) => (
                  <div key={f.accountId} className="flex-shrink-0 flex flex-col items-center gap-2 w-16">
                    <div className="relative">
                      <img src={f.avatarUrl} className="w-14 h-14 rounded-full border border-zinc-800" alt="" />
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black ${f.onlineStatus === 'online' ? 'bg-green-500' : 'bg-zinc-600'}`} />
                    </div>
                    <span className="text-[10px] font-medium truncate w-full text-center text-zinc-400">{f.onlineId}</span>
                  </div>
                ))}
              </div>

              {/* Games Grid */}
              <h3 className="font-bold mt-6 mb-4 px-1 uppercase text-xs tracking-widest text-zinc-500">Recent Games</h3>
              <div className="grid grid-cols-2 gap-4">
                {data?.games?.slice(0, 4).map((g: any) => (
                  <motion.div key={g.npCommunicationId} whileHover={{ scale: 1.03 }} className="group cursor-pointer">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-2 border border-white/5">
                      <img src={g.trophyTitleIconUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <p className="text-[11px] font-bold truncate uppercase tracking-tighter text-zinc-300">{g.trophyTitleName}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 italic uppercase text-xs tracking-widest">
              Section: {activeTab} Coming Soon
            </div>
          )}
        </div>

        {/* Floating Navigation Bar */}
        <nav className="absolute bottom-6 left-6 right-6 h-16 bg-zinc-900/90 backdrop-blur-2xl rounded-full border border-white/10 flex justify-around items-center px-2 z-30 shadow-2xl">
          <NavItem icon={<Gamepad2 size={24}/>} active={activeTab === 'play'} onClick={() => handleTabChange('play')} />
          <NavItem icon={<Users size={24}/>} active={activeTab === 'friends'} onClick={() => handleTabChange('friends')} />
          <NavItem icon={<MessageCircle size={24}/>} active={activeTab === 'chat'} onClick={() => handleTabChange('chat')} />
        </nav>
      </motion.div>
    </div>
  );
}

function NavItem({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className="relative flex-1 flex justify-center py-2 transition-all active:scale-90">
      <div className={`transition-colors duration-300 ${active ? 'text-blue-500' : 'text-zinc-500'}`}>
        {icon}
      </div>
      {active && (
        <motion.div layoutId="navGlow" className="absolute inset-0 bg-blue-500/10 rounded-full blur-md" />
      )}
    </button>
  );
}
