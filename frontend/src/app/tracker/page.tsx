"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { trackerApi } from "@/lib/api";
import { Calendar, CheckCircle, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function TrackerPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    } else {
      fetchDays();
    }
  }, [token, router]);

  const fetchDays = async () => {
    try {
      const data = await trackerApi.getDays();
      setDays(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (!user || loading) return <div className="min-h-[80vh] flex justify-center items-center terminal-text animate-pulse">LOADING_ROADMAP...</div>;

  return (
    <div className="py-8 animate-in fade-in duration-700">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="text-accent" /> 60-Day Execution Plan
          </h1>
          <p className="text-muted-foreground terminal-text text-sm">Select a day to view tasks and log progress.</p>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4">
        {days.map((item, i) => {
          const { day_plan, progress } = item;
          const isCompleted = progress?.is_day_completed;
          const isUnlocked = day_plan.day_number <= user.last_completed_day + 1;
          const isCurrent = day_plan.day_number === user.last_completed_day + 1;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              key={day_plan.id}
            >
              <button
                onClick={() => isUnlocked && router.push(`/tracker/day/${day_plan.day_number}`)}
                disabled={!isUnlocked}
                className={cn(
                  "relative w-full aspect-square rounded-xl p-3 flex flex-col items-center justify-center transition-all duration-300 border backdrop-blur-md",
                  isCompleted ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-400" :
                  isCurrent ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:border-primary" :
                  isUnlocked ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" :
                  "bg-black/40 border-white/5 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="text-xs text-muted-foreground font-mono mb-1">D{day_plan.day_number}</div>
                
                {isCompleted ? (
                   <CheckCircle className="text-green-500" size={24} />
                ) : isCurrent ? (
                   <Play className="text-primary neon-text-blue" size={24} />
                ) : isUnlocked ? (
                   <div className="w-2 h-2 rounded-full bg-white/30" />
                ) : (
                   <Lock className="text-muted-foreground" size={20} />
                )}

                <div className="absolute top-2 right-2 flex gap-1">
                  {progress?.dsa_completed && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  {progress?.ml_completed && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
