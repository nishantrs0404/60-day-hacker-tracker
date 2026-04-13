"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, LayoutDashboard, Settings, Code, Terminal, LogOut, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "60-Day Plan", href: "/tracker" },
    { icon: BookOpen, label: "Roadmap", href: "/roadmap" },
    { icon: Terminal, label: "Analytics", href: "/analytics" },
  ];

  return (
    <>
      {/* Mobile Navbar (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 px-6 py-3 flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              active ? "text-primary neon-text-blue" : "text-muted-foreground hover:text-white"
            )}>
              <Icon size={20} />
              <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar (Left) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 glass border-r border-white/10 py-6 items-center z-50">
        <Link href="/" className="mb-10 text-primary">
          <Code size={30} className="neon-text-blue" />
        </Link>
        <div className="flex flex-col gap-6 flex-1 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} title={item.label} className={cn(
                "p-3 rounded-xl flex items-center justify-center transition-all duration-300 w-full group",
                active ? "bg-primary/20 text-primary neon-text-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}>
                <Icon size={24} className={cn("group-hover:scale-110 transition-transform", active && "scale-110")} />
              </Link>
            );
          })}
        </div>
        
        {user ? (
            <div className="flex flex-col items-center gap-4 mt-auto w-full px-2">
              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-accent/20 border border-accent/50 text-accent font-bold neon-text-green text-sm" title={user.username}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button onClick={logout} className="p-3 text-muted-foreground hover:text-destructive w-full flex justify-center rounded-xl hover:bg-destructive/10 transition-colors">
                <LogOut size={22} />
              </button>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-4 mt-auto w-full px-2">
              <Link href="/auth" className="text-xs font-mono text-muted-foreground hover:text-white p-2 text-center w-full rounded-xl hover:bg-white/5">
                LOGIN
              </Link>
            </div>
        )}
      </nav>
    </>
  );
}
