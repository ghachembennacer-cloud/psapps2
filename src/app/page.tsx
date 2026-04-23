"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Users, MessageCircle, Bell, Settings } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("play");
  const [psnData, setPsnData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/psn").then(res => res.json()).then(json => setPsnData(json));
  }, []);

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-[400px] h-[800px] bg-black border border-white/10 rounded-[3rem] relative flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-3xl font-black italic uppercase">Play</h1>
          <div className="flex gap-4 opacity-50"><Bell size={20} /><Settings size={20} /></div>
        </div>

        {/* Dynamic Content Switching Logic */}
        <div className="flex-1 px-6 overflow-y-auto">
          {activeTab === "play" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="h-32 bg-blue-600 rounded-[2rem] p-6 mb-8 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse" />
                <div className="h-4 w-32 bg-white/20 rounded" />
              </div>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Recent</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-zinc-900 rounded-3xl" />)}
              </div>
            </motion.div>
          )}

          {activeTab !== "play" && (
            <div className="flex flex-col items-center justify-center h-full opacity-30 italic text-sm">
              Section {activeTab} coming soon
            </div>
          )}
        </div>

        {/* Navigation Bar - Buttons are now fully functional */}
        <nav className="h-24 bg-zinc-900/50 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-4">
          <button onClick={() => setActiveTab("play")} className={`p-4 transition-all ${activeTab === 'play' ? 'text-blue-500 scale-125' : 'text-zinc-500'}`}>
            <Gamepad2 />
          </button>
          <button onClick={() => setActiveTab("friends")} className={`p-4 transition-all ${activeTab === 'friends' ? 'text-blue-500 scale-125' : 'text-zinc-500'}`}>
            <Users />
          </button>
          <button onClick={() => setActiveTab("chat")} className={`p-4 transition-all ${activeTab === 'chat' ? 'text-blue-500 scale-125' : 'text-zinc-500'}`}>
            <MessageCircle />
          </button>
        </nav>
      </div>
    </div>
  );
}
