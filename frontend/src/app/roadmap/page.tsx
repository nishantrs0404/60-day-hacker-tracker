"use client"
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { trackerApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen, Brain, Code, Rocket, Search } from "lucide-react";

interface DayPlan {
  day_number: number;
  title: string;
  week: number;
  dsa_task: string;
  ml_task: string;
  dev_task: string;
  deploy_task: string;
}

export default function RoadmapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [days, setDays] = useState<DayPlan[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      trackerApi.getDays().then((data: any) => {
        const plans = data.map((d: any) => d.day_plan || d);
        setDays(plans);
      });
    }
  }, [user]);

  if (!user || loading) return <div className="min-h-[80vh] flex justify-center items-center terminal-text animate-pulse">LOADING_ROADMAP...</div>;

  const weeks = Array.from(new Set(days.map(d => d.week))).sort((a, b) => a - b);

  const filteredDays = days.filter(d => {
    const matchesWeek = filterWeek === null || d.week === filterWeek;
    const matchesSearch = searchQuery === "" || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dsa_task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ml_task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dev_task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.deploy_task.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWeek && matchesSearch;
  });

  const taskCategories = [
    { key: "dsa_task", label: "DSA", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { key: "ml_task", label: "ML / AI", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { key: "dev_task", label: "Development", icon: Code, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
    { key: "deploy_task", label: "Deployment", icon: Rocket, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  ];

  return (
    <div className="py-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold neon-text-blue mb-2">Complete 60-Day Roadmap</h1>
        <p className="text-muted-foreground terminal-text text-sm">{'>'} Preview the entire execution protocol. Read-only overview of all 60 days.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search topics, tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Week Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterWeek(null)}
            className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${filterWeek === null ? "bg-primary/20 text-primary border border-primary/50" : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"}`}
          >
            ALL
          </button>
          {weeks.map(w => (
            <button
              key={w}
              onClick={() => setFilterWeek(filterWeek === w ? null : w)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${filterWeek === w ? "bg-primary/20 text-primary border border-primary/50" : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"}`}
            >
              W{w}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card p-4 mb-8 flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-mono">Showing <span className="text-white font-bold">{filteredDays.length}</span> of {days.length} days</span>
        <span className="text-muted-foreground font-mono">{weeks.length} weeks • 4 tracks per day</span>
      </div>

      {/* Day Cards */}
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {filteredDays.map((day) => {
            const isExpanded = expandedDay === day.day_number;
            return (
              <motion.div
                key={day.day_number}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-card overflow-hidden"
              >
                {/* Day Header (clickable) */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day.day_number)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center font-mono text-primary font-bold text-sm">
                      D{day.day_number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{day.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono">Week {day.week}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="text-muted-foreground" size={20} />
                  ) : (
                    <ChevronDown className="text-muted-foreground" size={20} />
                  )}
                </button>

                {/* Expanded Task Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {taskCategories.map(({ key, label, icon: Icon, color, bg, border }) => (
                          <div key={key} className={`p-3 rounded-lg ${bg} border ${border}`}>
                            <div className={`flex items-center gap-2 mb-2 ${color}`}>
                              <Icon size={14} />
                              <span className="text-xs font-mono font-bold tracking-wider">{label}</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">
                              {(day as any)[key]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredDays.length === 0 && (
        <div className="text-center py-16 text-muted-foreground terminal-text">
          No days match your search. Try a different query.
        </div>
      )}
    </div>
  );
}
