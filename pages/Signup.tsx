import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, Moon, Sun, User, Mail, Lock, Globe, Check } from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from "../supabaseClient";



interface SignupProps {
  onLogin: () => void;
  onSwitchToLogin: () => void;
  onBackHome: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onLogin, onSwitchToLogin, onBackHome, isDark, toggleTheme }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'English',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password, name, language } = formData;

    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            language: language
          }
        }
      });

      if (error) {
        // Check if user already exists
        if (error.message.includes("already registered")) {
          alert("This email is already registered. Please login instead.");
          onSwitchToLogin();
        } else {
          alert(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        alert("Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Step 2: Create or update profile entry
      const { error: profileError } = await supabase.from("profiles")
        .upsert({
          id: data.user.id,
          name_text: name,
          email_text: email,
          full_name: name,
          role_text: "contributor",
          profile_completed: false,
          trust_score: 100
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        alert(`Account created but profile setup failed: ${profileError.message}`);
        setIsLoading(false);
        return;
      }

      // Success message
      const confirmationMessage = data.user.identities?.length === 0
        ? "Account already exists! Please check your email or login."
        : "Account created successfully! You can now login.";

      alert(confirmationMessage);
      setIsLoading(false);

      // Redirect to login after successful signup
      setTimeout(() => {
        onSwitchToLogin();
      }, 1000);

    } catch (err) {
      console.error("Signup error:", err);
      alert("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-500">

      {/* Header */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={onBackHome}>
            <Logo className="h-6 w-6 text-blue-600 dark:text-blue-500 transition-transform duration-500 group-hover:rotate-180" />
            <span className="font-bold text-sm tracking-[0.1em] text-zinc-900 dark:text-white uppercase">Starset</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 dark:bg-emerald-600/10 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 pt-20">
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-md border border-zinc-200 dark:border-white/10">
              <Logo className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-bold text-2xl tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 uppercase">STARSET</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">New Contributor Profile</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Join the network to start earning.</p>
        </div>

        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                  placeholder="Full Legal Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Globe className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                <select
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white appearance-none"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Hindi</option>
                  <option>Mandarin</option>
                  <option>French</option>
                </select>
              </div>

              <div className="relative group">
                <Lock className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-white/50 dark:bg-black/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <div className="flex items-center h-5">
                <input id="terms" type="checkbox" required className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
              </div>
              <label htmlFor="terms" className="text-xs text-zinc-500 dark:text-zinc-400">
                I agree to the <a href="#" className="underline hover:text-emerald-500">Contributor Agreement</a> and <a href="#" className="underline hover:text-emerald-500">Privacy Policy</a>.
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 mt-4" isLoading={isLoading}>
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-sm text-center text-zinc-500 mt-6 leading-relaxed">
              Already have an ID? <button type="button" onClick={onSwitchToLogin} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors font-bold ml-1">Log In</button>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 w-full flex items-center justify-center gap-2 pointer-events-none">
        <Logo className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
        <span className="text-zinc-500 dark:text-zinc-600 text-[10px] uppercase tracking-widest">
          Starset Network • Secure Environment • v2.4.0
        </span>
      </div>
    </div>
  );
};