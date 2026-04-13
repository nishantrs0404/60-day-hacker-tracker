"use client"
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Terminal, Lock, User as UserIcon, Mail } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        const res = await axios.post("http://localhost:8000/api/auth/login", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        login(res.data.access_token);
        router.push("/dashboard");
      } else {
        await axios.post("http://localhost:8000/api/auth/register", {
          username, email, password
        });
        setIsLogin(true);
        setError("Registration successful. Please log in.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] relative py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="flex justify-center mb-6 text-primary">
          <Terminal size={48} className="neon-text-blue" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8 terminal-text">
          {isLogin ? "> AUTH_REQUIRED" : "> INIT_NEW_USER"} <span className="animate-pulse">_</span>
        </h2>
        
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold tracking-wider text-sm mt-4 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isLogin ? "EXECUTE LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-sm text-muted-foreground hover:text-white transition-colors"
          >
            {isLogin ? "No account? Establish connection." : "Already registered? Login here."}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
