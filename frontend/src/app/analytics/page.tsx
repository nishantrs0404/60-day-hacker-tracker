"use client"
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Zap } from "lucide-react";
import { trackerApi } from "@/lib/api";

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return router.push("/auth");
    
    // Process analytics from days data
    trackerApi.getDays().then((days) => {
      // Mock processing for chart (cumulative XP over the days they completed)
      let currentXp = 0;
      const chartData = days.map((d: any) => {
        if (d.progress?.is_day_completed) {
          currentXp += 100; // Base xp
        }
        return {
          name: `D${d.day_plan.day_number}`,
          xp: d.progress?.is_day_completed ? currentXp : null,
          completed: d.progress?.is_day_completed ? 1 : 0
        };
      }).filter((d: any) => d.completed === 1);
      
      setData(chartData);
    });
  }, [token]);

  if (!user) return <div className="min-h-[80vh] flex justify-center items-center terminal-text animate-pulse">LOADING_ANALYTICS...</div>;

  return (
    <div className="py-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="text-primary neon-text-blue" /> Telemetry & Analytics
          </h1>
          <p className="text-muted-foreground terminal-text text-sm">Visualizing your execution velocity.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-sm text-muted-foreground mb-2">Total Output</h3>
          <p className="text-3xl font-mono text-white flex items-center gap-2"><Zap size={20} className="text-accent" /> {user.last_completed_day} / 60</p>
        </div>
        <div className="glass-card p-6 border-b-2 border-b-blue-500">
          <h3 className="text-sm text-muted-foreground mb-2">XP Velocity</h3>
          <p className="text-3xl font-mono text-white">{user.xp}</p>
        </div>
        <div className="glass-card p-6 border-b-2 border-b-orange-500">
          <h3 className="text-sm text-muted-foreground mb-2">Peak Streak</h3>
          <p className="text-3xl font-mono text-white">{user.max_streak}</p>
        </div>
      </div>

      <div className="glass-card p-6 w-full h-[400px]">
        <h3 className="mb-6 font-mono text-sm tracking-widest text-muted-foreground">CUMULATIVE EXPERIENCE GRAPH</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161616', borderColor: '#2a2a2a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
