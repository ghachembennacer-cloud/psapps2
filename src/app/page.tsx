"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Users, MessageCircle, Bell, Settings, Trophy, AlertCircle } from "lucide-react";

export default function PSAppPro() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("play");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/psn");
        const result = await res.json();
        if (!result.success) throw new Error(result.error);
        setStore(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Complex Logic: Memoized content to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (activeTab === "play") return <PlaySection data={store} />;
    return <div className="flex items-center justify-center h-64 text-zinc-600 italic">Coming Soon</div>;
  }, [activeTab, store]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center items-center font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[430px] h-[92vh] bg-black border border-white/10 rounded-[3rem] relative flex flex-col shadow-2xl overflow-hidden"
      >
        <header className="p-8 flex justify-between items-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Play</h1>
          <div className="flex gap-4">
            <Bell className="text-zinc-400" size={20} />
            <Settings className="text-zinc-400" size={20} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-32 hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Improved Navigation Logic */}
        <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-full flex items-center justify-around px-4 shadow-2xl">
          <NavItem active={activeTab === "play"} onClick={() => setActiveTab("play")} icon={<Gamepad2 size={24} />} />
          <NavItem active={activeTab === "friends"} onClick={() => setActiveTab("friends")} icon={<Users size={24} />} />
          <NavItem active={activeTab === "chat"} onClick={() => setActiveTab("chat")} icon={<MessageCircle size={24} />} />
        </nav>
      </motion.div>
    </div>
  );
}

function PlaySection({ data }: any) {
  return (
    <div className="space-y-8">
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-blue-700 to-blue-900 flex items-center gap-4">
        <img src={data?.friends?.[0]?.avatarUrl} className="w-16 h-16 rounded-full border-2 border-white shadow-xl" />
        <div>
          <h2 className="text-xl font-bold">PS User</h2>
          <p className="text-xs font-bold opacity-70 uppercase tracking-widest flex items-center gap-2">
            <Trophy size={12} className="text-yellow-400" /> Level 240
          </p>
        </div>
      </div>

      <section>
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Played Recently</h3>
        <div className="grid grid-cols-2 gap-4">
          {data?.games?.slice(0, 4).map((game: any) => (
            <div key={game.npCommunicationId} className="group">
              <div className="aspect-square rounded-3xl overflow-hidden mb-2 border border-white/5">
                <img src={game.trophyTitleIconUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="text-[10px] font-bold truncate text-zinc-400 uppercase">{game.trophyTitleName}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function NavItem({ active, onClick, icon }: any) {
  return (
    <button onClick={onClick} className={`p-3 rounded-full transition-all ${active ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-500'}`}>
      {icon}
    </button>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold uppercase italic">Sync Failed</h2>
      <p className="text-zinc-500 text-sm mt-2 mb-8">{message}</p>
      <button onClick={() => window.location.reload()} className="bg-white text-black font-bold px-8 py-3 rounded-full uppercase text-xs">Retry</button>
    </div>
  );
}
