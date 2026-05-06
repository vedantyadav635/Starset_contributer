import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, User, Mail, Lock, Eye, EyeOff, Globe, Check, Sun, Moon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from "../supabaseClient";



interface SignupProps {
  onLogin: () => void;
  onSwitchToLogin: () => void;
  onBackHome: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onLogin, onSwitchToLogin, onBackHome }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password, name } = formData;

    try {
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
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
          full_name: name,
          email_text: email, // Add this for admin join
          role: "contributor",
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-50 dark:bg-[#020205]">

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 pt-8 pb-8">
        <div className="mb-6 md:mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="h-12 w-12 md:h-16 md:w-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md border border-white/10">
              <Logo className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 uppercase">STARSET</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-white">New Contributor Profile</h1>
          <p className="text-zinc-400 text-xs md:text-sm px-4">Join the network to start earning from data contributions.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-2xl p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl mx-1 md:mx-0">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>


              <div className="relative group">
                <Lock className="absolute top-3.5 left-4 h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 right-4 text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <div className="flex items-center h-5">
                <input id="terms" type="checkbox" required className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <label htmlFor="terms" className="text-xs text-slate-500 dark:text-zinc-400">
                I agree to the <a href="#" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Contributor Agreement</a> and <a href="#" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Privacy Policy</a>.
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 shadow-[0_0_20px_rgba(59,130,246,0.2)] bg-blue-600 hover:bg-blue-500 border-blue-500/50 mt-4" isLoading={isLoading}>
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-sm text-center text-slate-500 dark:text-zinc-500 mt-6 leading-relaxed">
              Already have an ID? <button type="button" onClick={onSwitchToLogin} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-bold ml-1">Log In</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};
