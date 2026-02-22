import React, { useState } from "react";
import { Button } from "../components/Button";
import {
  ArrowRight,
  AlertCircle,
  Shield,
  User,
  Lock,
  Key,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { UserRole } from "../types";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { AuthProvider } from "../context/AuthContext";

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onSwitchToSignup: () => void;
  onBackHome: () => void;
  onForgotPassword?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onSwitchToSignup,
  onBackHome,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [user , setuser] = useState(null);

  const { login, user } = useAuth();
  const [loginMode, setLoginMode] = useState<UserRole>("contributor");
  const isContributor = loginMode === "contributor";


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call login from AuthContext
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || "Login failed");
        setIsLoading(false);
        return;
      }

      if (!result.user) {
        setError("Login failed - no user data");
        setIsLoading(false);
        return;
      }

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", result.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        setError("Failed to load user profile");
        setIsLoading(false);
        return;
      }

      const userRole = profile?.role || "contributor";

      // 🔐 ADMIN LOGIN CHECK
      if (loginMode === "admin") {
        if (userRole !== "admin") {
          setError("You are not authorized as admin");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }
        onLogin("admin");
        setIsLoading(false);
        return;
      }

      // 👤 CONTRIBUTOR LOGIN
      onLogin("contributor");
      setIsLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };


  const toggleLoginMode = () => {
    setLoginMode((prev) =>
      prev === "contributor" ? "admin" : "contributor"
    );
    setError(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-500">

      {/* Header */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={onBackHome}>
            <Logo className="h-10 w-10 md:h-14 md:w-14 transition-transform duration-500 group-hover:rotate-180" />
            <span className="font-bold text-xs md:text-sm tracking-[0.1em] text-zinc-900 dark:text-white uppercase">Starset</span>
          </div>
        </div>
      </nav>

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[80px] md:blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 pt-16 md:pt-20">
        <div className="mb-6 md:mb-8 text-center px-4">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="h-12 w-12 md:h-16 md:w-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md border border-zinc-200 dark:border-white/10">
              {isContributor ? (
                <Logo className="h-10 w-10 md:h-14 md:w-14" />
              ) : (
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              )}
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 uppercase">STARSET</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-zinc-900 dark:text-white">
            {isContributor ? "Contributor Access" : "Admin Console"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">
            {isContributor
              ? "Enter your credentials to access the node."
              : "Authorized personnel only. Activities logged."}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-3xl border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-2xl mx-1 md:mx-0">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute top-3.5 left-4 h-5 w-5 pointer-events-none transition-colors">
                  {isContributor ? (
                    <User className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-purple-400 group-focus-within:text-purple-500" />
                  )}
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                  placeholder={isContributor ? "Work Email (name@starset.ai)" : "Admin ID (admin@starset.ai)"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {onForgotPassword && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full h-12 shadow-[0_0_20px_rgba(59,130,246,0.2)] bg-blue-600 hover:bg-blue-500 border-blue-500/50 mt-4" isLoading={isLoading}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="pt-4 border-t border-zinc-200 dark:border-white/10 mt-6 text-center space-y-4">
              {isContributor && (
                <div className="text-sm text-zinc-500">
                  New contributor? <button type="button" onClick={onSwitchToSignup} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-bold ml-1">Create Account</button>
                </div>
              )}

              <button
                type="button"
                onClick={toggleLoginMode}
                className="text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center justify-center gap-2 w-full"
              >
                {isContributor ? (
                  <>
                    <Key className="h-3.5 w-3.5" /> Administrator Access
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5" /> Contributor Access
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 w-full flex items-center justify-center gap-2 pointer-events-none">
        <Logo className="h-12 w-12" />
        <span className="text-zinc-500 dark:text-zinc-600 text-[10px] uppercase tracking-widest">
          Starset Network • Secure Environment • v2.5.4
        </span>
      </div>
    </div>
  );
};
