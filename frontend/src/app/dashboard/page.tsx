"use client"
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  if (!user) return <div className="min-h-[80vh] flex items-center justify-center terminal-text animate-pulse">LOADING_DATA...</div>;

  // Level thresholds approximation for progress bar
  const getProgressToNextLevel = (xp: number, level: number) => {
    const levelCaps = [0, 200, 500, 1000, 1500, 2500, 4000, 6000, 8500, 12000];
    const prevCap = levelCaps[level - 1] || 0;
    const nextCap = levelCaps[level] || 12000;
    const currentProgress = xp - prevCap;
    const totalRequired = nextCap - prevCap;
    return (currentProgress / totalRequired) * 100;
  };

  const progressPercent = getProgressToNextLevel(user.xp, user.level);

  return (
    <div className="py-8 animate-in fade-in duration-700">
      <header className="mb-8">
        <h1 className="text-3xl font-bold neon-text-blue mb-2">Welcome back, {user.username}</h1>
        <p className="text-muted-foreground terminal-text text-sm">{'>'} System status: ONLINE</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Streak Card */}
        <motion.div whileHover={{ y: -5 }} className="glass-card p-6 border-b-4 border-b-orange-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider">CURRENT STREAK</h3>
            <Flame className="text-orange-500" size={24} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold neon-text-amber">{user.current_streak}</span>
            <span className="text-muted-foreground text-sm">days</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground flex justify-between">
            <span>Max Streak:</span>
            <span className="font-mono text-white">{user.max_streak}</span>
          </div>
        </motion.div>

        {/* Level Card */}
        <motion.div whileHover={{ y: -5 }} className="glass-card p-6 border-b-4 border-b-purple-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider">HACKER LEVEL</h3>
            <Star className="text-purple-500" size={24} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold neon-text-purple">{user.level}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs flex justify-between">
            <span className="text-muted-foreground">Rank:</span>
            <span className="font-mono text-purple-400">Novice Exec</span>
          </div>
        </motion.div>

        {/* XP Card */}
        <motion.div whileHover={{ y: -5 }} className="glass-card p-6 border-b-4 border-b-blue-500 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider">TOTAL EXPERIENCE</h3>
            <Trophy className="text-blue-500" size={24} />
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold neon-text-blue">{user.xp}</span>
            <span className="text-muted-foreground text-sm">XP</span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-xs text-muted-foreground">Level {user.level} Progress</div>
              <div className="text-xs font-mono text-white">{Math.round(progressPercent)}%</div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
              <div style={{ width: `${progressPercent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action / Notice */}
      <div className="glass p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Target className="text-accent" /> Next Target</h3>
          <p className="text-muted-foreground text-sm">You are currently on Day {user.last_completed_day + 1} of your 60-Day execution roadmap.</p>
        </div>
        <button onClick={() => router.push("/tracker")} className="bg-white/10 hover:bg-white/20 transition-colors border border-white/20 px-6 py-3 rounded-lg font-mono text-sm tracking-wide shrink-0">
          EXECUTE DAY {user.last_completed_day + 1} &gt;
        </button>
      </div>

    </div>
  );
}
