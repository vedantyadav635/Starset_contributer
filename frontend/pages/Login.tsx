import React, { useState } from "react";
import { Button } from "../components/Button";
import {
  ArrowRight,
  Moon,
  Sun,
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
  isDark: boolean;
  toggleTheme: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onSwitchToSignup,
  onBackHome,
  isDark,
  toggleTheme,
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
        .select("role_text")
        .eq("id", result.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        setError("Failed to load user profile");
        setIsLoading(false);
        return;
      }

      const userRole = profile?.role_text || "contributor";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={onBackHome}
          >
            <Logo className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-sm tracking-widest uppercase">
              Starset
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            {isDark ? <Moon /> : <Sun />}
          </button>
        </div>
      </nav>

      {/* CARD */}
      <div className="w-full max-w-md z-10 pt-20">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center border backdrop-blur-md">
              {isContributor ? (
                <Logo className="h-8 w-8" />
              ) : (
                <Shield className="h-8 w-8 text-purple-500" />
              )}
            </div>
          </div>

          <h1 className="text-xl font-bold">
            {isContributor ? "Contributor Access" : "Admin Console"}
          </h1>
          <p className="text-sm text-zinc-500">
            {isContributor
              ? "Enter your credentials to access the node."
              : "Authorized personnel only. Activities logged."}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-2xl border shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold uppercase mb-2">
                {isContributor ? "Work Email" : "Admin ID"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isContributor ? (
                    <User className="h-5 w-5 text-zinc-400" />
                  ) : (
                    <Shield className="h-5 w-5 text-purple-400" />
                  )}
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg border bg-white/50 dark:bg-black/20"
                  placeholder={
                    isContributor
                      ? "name@starset.ai"
                      : "admin@starset.ai"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border bg-zinc-900/60 text-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full h-11"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="pt-4 border-t mt-4 text-center">
            {isContributor && (
              <div className="text-xs mb-2">
                New contributor?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 font-bold"
                >
                  Create Account
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={toggleLoginMode}
              className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 flex items-center justify-center gap-2"
            >
              {isContributor ? (
                <>
                  <Key className="h-3 w-3" /> Administrator Login
                </>
              ) : (
                <>
                  <User className="h-3 w-3" /> Contributor Login
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 text-[10px] text-zinc-500 flex items-center gap-2">
        <Logo className="h-4 w-4" />
        Starset Network • Secure Environment • v2.5.4
      </div>
    </div>
  );
};
