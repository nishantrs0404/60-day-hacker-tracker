"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, Flame, ChevronRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center max-w-3xl"
      >
        <div className="flex justify-center mb-6">
          <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 border-primary/30">
            <Flame className="text-primary w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Elite Execution Protocol</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          60-Day <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 neon-text-blue">
            Performance
          </span> Tracker
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
          Gamified execution dashboard for DSA, AI Engineering, Backend Development, and Deployment. Built for top-tier placement success.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold font-mono text-sm tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2 transition-colors border border-blue-400"
            >
              <Zap size={18} /> INITIALIZE PROTOCOL
            </motion.button>
          </Link>
          <Link href="/tracker">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold font-mono text-sm tracking-wide text-white flex items-center gap-2 transition-colors border border-white/20"
            >
              VIEW ROADMAP <ChevronRight size={18} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
