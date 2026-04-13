"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { trackerApi } from "@/lib/api";
import { CheckSquare, Square, ArrowLeft, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DayViewPage() {
  const params = useParams();
  const dayId = Number(params?.id);
  const { user, token, fetchUser } = useAuth();
  const router = useRouter();

  const [dayData, setDayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Checks state
  const [dsa, setDsa] = useState(false);
  const [ml, setMl] = useState(false);
  const [dev, setDev] = useState(false);
  const [deploy, setDeploy] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return router.push("/auth");
    if (dayId) fetchDay();
  }, [dayId, token]);

  const fetchDay = async () => {
    try {
      const data = await trackerApi.getDay(dayId);
      setDayData(data.day_plan);
      if (data.progress) {
        setDsa(Boolean(data.progress.dsa_completed));
        setMl(Boolean(data.progress.ml_completed));
        setDev(Boolean(data.progress.dev_completed));
        setDeploy(Boolean(data.progress.deploy_completed));
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trackerApi.updateProgress(dayId, {
        dsa_completed: dsa,
        ml_completed: ml,
        dev_completed: dev,
        deploy_completed: deploy
      });
      await fetchUser(); // Updates XP and Level globally
      setSaving(false);
      router.push("/tracker");
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  if (loading || !dayData) return <div className="min-h-[80vh] flex justify-center items-center animate-pulse terminal-text">LOADING_DATA...</div>;

  const sections = [
    { id: "dsa", title: "Data Structures & Algorithms", task: dayData.dsa_task, state: dsa, set: setDsa, color: "text-blue-400", border: "border-blue-500/30" },
    { id: "ml", title: "Machine Learning / AI Engineering", task: dayData.ml_task, state: ml, set: setMl, color: "text-green-400", border: "border-green-500/30" },
    { id: "dev", title: "Backend Development", task: dayData.dev_task, state: dev, set: setDev, color: "text-amber-400", border: "border-amber-500/30" },
    { id: "deploy", title: "Deployment / DevOps", task: dayData.deploy_task, state: deploy, set: setDeploy, color: "text-teal-400", border: "border-teal-500/30" },
  ];

  return (
    <div className="py-8 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <button onClick={() => router.push("/tracker")} className="flex items-center gap-2 text-muted-foreground hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Tracker
      </button>

      <header className="mb-8 p-6 glass-card border-none bg-primary/5">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="text-primary animate-pulse" />
          <h1 className="text-3xl font-bold font-mono tracking-tighter">DAY_{dayData.day_number}</h1>
        </div>
        <h2 className="text-xl text-white/90">{dayData.title}</h2>
        <p className="text-muted-foreground text-sm mt-2">Week {dayData.week} of the 60-Day Execution Protocol.</p>
      </header>

      <div className="flex flex-col gap-4 mb-8">
        {sections.map((sec) => (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            key={sec.id} 
            className={cn("glass-card p-6 flex flex-col md:flex-row gap-4 justify-between items-start cursor-pointer border-l-4", sec.border)}
            onClick={() => sec.set(!sec.state)}
          >
            <div className="flex-1">
              <h3 className={cn("text-lg font-bold mb-2 flex items-center gap-2", sec.color)}>
                {sec.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap font-mono relative pl-4 border-l border-white/10">
                {sec.task}
              </p>
            </div>
            <div className="flex-shrink-0 mt-2 md:mt-0 pt-2">
              {sec.state ? (
                <CheckSquare size={32} className="text-accent drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              ) : (
                <Square size={32} className="text-muted-foreground" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold tracking-widest text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? "SAVING..." : "COMMIT PROGRESS"}
        </button>
      </div>
    </div>
  );
}
