import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, Activity, Database, Server, Zap, Globe, ShieldCheck, Lock, Smartphone, Banknote, Mic, Image as ImageIcon, MessageSquare, CheckCircle2, ChevronDown, Play, Star, TrendingUp, Users, Cpu, FileText } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { BrainCircuit } from 'lucide-react';

interface LandingPageProps {
   onEnterApp: () => void;
   onStartSignup: () => void;
   isDark: boolean;
   toggleTheme: () => void;
   onNavigate: (page: PublicPageType) => void;
}

// Decorative Sparkle Component
const Sparkle = ({ className }: { className?: string }) => (
   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
   </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onStartSignup, isDark, toggleTheme, onNavigate }) => {
   const [activeNodeCount, setActiveNodeCount] = useState(8432);
   const [openFaq, setOpenFaq] = useState<number | null>(null);

   useEffect(() => {
      // Simulate live node count fluctuation
      const interval = setInterval(() => {
         setActiveNodeCount(prev => prev + Math.floor(Math.random() * 5) - 2);
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
   };

   return (
      <PublicLayout currentPage="home" onNavigate={onNavigate} onEnterApp={onEnterApp} isDark={isDark} toggleTheme={toggleTheme}>

         {/* --- HERO SECTION --- */}
         <section className="relative z-10 pt-8 md:pt-12 pb-12 md:pb-24 px-4 md:px-6 overflow-hidden perspective-1000">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-[100%] blur-[80px] -z-10 pointer-events-none animate-pulse-glow"></div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-20">

               {/* Left Column: Text Content */}
               <div className="text-center lg:text-left space-y-8">
                  <div className="inline-block relative">
                     <Sparkle className="absolute -top-6 -right-6 w-8 h-8 text-purple-400/60 animate-bounce delay-700 hidden lg:block" />
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-xs font-bold text-blue-700 dark:text-blue-300 font-mono backdrop-blur-md shadow-lg shadow-blue-500/10 hover:scale-105 transition-transform cursor-default">
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        SYSTEM ONLINE v2.4
                     </div>
                  </div>

                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-zinc-900 dark:text-white relative drop-shadow-2xl">
                     Make Money <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-300 bg-[length:200%_auto] animate-marquee">
                        Teaching AI.
                     </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                     Join 50,000+ contributors earning cash by completing simple tasks. <span className="text-zinc-900 dark:text-white">No coding required.</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                     <div className="relative group w-full sm:w-auto hover:-translate-y-1 transition-transform">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
                        <Button onClick={onStartSignup} size="lg" variant={isDark ? "black" : "black"} className="relative h-14 md:h-16 px-10 text-lg md:text-xl w-full sm:w-auto font-bold bg-zinc-900 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-2xl">
                           Start Earning <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                     </div>
                     <Button onClick={() => onNavigate('about')} size="lg" variant="ghost" className="h-14 md:h-16 px-8 text-lg md:text-xl border-2 border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 w-full sm:w-auto hover:bg-zinc-100 dark:hover:bg-white/5 backdrop-blur-sm">
                        How it Works
                     </Button>
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 text-xs font-bold text-zinc-500 font-mono tracking-wider">
                     <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-md border border-zinc-200 dark:border-white/5">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> SECURE PAYMENTS
                     </div>
                     <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-md border border-zinc-200 dark:border-white/5">
                        <Lock className="h-4 w-4 text-blue-500" /> NO EXPERIENCE
                     </div>
                  </div>
               </div>

               {/* Right Column: Nexus Visual */}
               <div className="relative h-[300px] lg:h-[600px] w-full flex items-center justify-center select-none perspective-2000 mt-12 lg:mt-0">

                  {/* Background Glow for Visual */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse-glow"></div>

                  {/* Main Container */}
                  <div className="relative w-full h-full flex items-center justify-between max-w-[500px] lg:max-w-[800px] mx-auto scale-90 lg:scale-100 transform-style-3d hover:rotate-y-12 transition-transform duration-700">

                     {/* Connecting Path Background */}
                     <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-zinc-800 -translate-y-1/2 z-0"></div>

                     {/* Left Stream: YOU -> NEXUS */}
                     <div className="absolute left-[12%] right-[50%] top-1/2 -translate-y-1/2 h-20 overflow-hidden z-0 pointer-events-none mix-blend-screen">
                        {/* Blue Particles */}
                        <div
                           className="w-full h-full opacity-80 animate-data-stream"
                           style={{
                              backgroundImage: `radial-gradient(circle, #3b82f6 2px, transparent 3px)`,
                              backgroundSize: '24px 24px',
                              backgroundRepeat: 'repeat'
                           }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-sm"></div>
                     </div>

                     {/* Right Stream: NEXUS -> AI */}
                     <div className="absolute left-[50%] right-[12%] top-1/2 -translate-y-1/2 h-20 overflow-hidden z-0 pointer-events-none mix-blend-screen">
                        {/* Purple Particles */}
                        <div
                           className="w-full h-full opacity-80 animate-data-stream"
                           style={{
                              backgroundImage: `radial-gradient(circle, #d946ef 2px, transparent 3px)`,
                              backgroundSize: '24px 24px',
                              backgroundRepeat: 'repeat',
                              animationDirection: 'reverse'
                           }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-sm"></div>
                     </div>

                     {/* Left Node: YOU */}
                     <div className="relative z-10 flex flex-col items-center gap-4 group">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#0a0a0a] border border-blue-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all duration-300 relative overflow-hidden">
                           <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                           <div className="relative z-10 flex flex-col items-center">
                              <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400 mb-1" />
                              <Users className="w-3 h-3 lg:w-4 lg:h-4 text-blue-300 absolute -bottom-1 -right-1" />
                           </div>
                           {/* Scan line effect */}
                           <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/50 blur-sm animate-slide-up" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                        </div>
                        <div className="px-3 py-1 bg-blue-950/50 border border-blue-500/30 rounded-full text-[10px] font-bold text-blue-400 tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                           YOU
                        </div>
                     </div>

                     {/* Center Node: NEXUS */}
                     <div className="relative z-20 flex flex-col items-center justify-center scale-100 lg:scale-110">
                        {/* Rotating Rings Container - INCREASED SIZE */}
                        <div className="relative w-48 h-48 lg:w-80 lg:h-80 flex items-center justify-center">

                           {/* Outer Glow */}
                           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl animate-pulse"></div>

                           {/* Outer Dashed Ring - Spins Slow */}
                           <svg className="absolute inset-0 w-full h-full animate-spin-slower" viewBox="0 0 100 100">
                              <defs>
                                 <linearGradient id="ringGradientHero" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                 </linearGradient>
                              </defs>
                              <circle cx="50" cy="50" r="49" fill="none" stroke="url(#ringGradientHero)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />
                              <circle cx="50" cy="50" r="44" fill="none" stroke="#3b82f6" strokeWidth="0.2" opacity="0.4" />
                           </svg>

                           {/* Middle Tech Ring - Reverse Spin */}
                           <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] animate-reverse-spin-slow" viewBox="0 0 100 100">
                              <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0 0 4px #3b82f6)" />
                              <path d="M50 95 A45 45 0 0 1 5 50" fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0 0 4px #d946ef)" />
                           </svg>

                           {/* Inner Glow Core */}
                           <div className="absolute inset-12 lg:inset-20 bg-[#050505] rounded-full border border-white/10 flex items-center justify-center z-10 shadow-[inset_0_0_30px_rgba(0,0,0,1)] overflow-hidden">
                              {/* Core Background Effect */}
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>

                              <div className="text-center relative z-20">
                                 <div className="text-[10px] lg:text-xs text-blue-300/70 font-mono tracking-widest mb-1 lg:mb-2">STARSET</div>
                                 <div className="text-2xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 tracking-tight leading-none mb-2 drop-shadow-lg">NEXUS</div>
                                 <div className="text-[8px] lg:text-[10px] font-bold text-emerald-400 tracking-widest animate-pulse border border-emerald-500/30 px-2 lg:px-3 py-0.5 rounded-full bg-emerald-950/30 inline-block">PROCESSING</div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Right Node: SMART AI */}
                     <div className="relative z-10 flex flex-col items-center gap-4 group">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#0a0a0a] border border-purple-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transition-all duration-300 relative overflow-hidden">
                           <div className="absolute inset-0 bg-purple-500/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                           <Cpu className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400 relative z-10" />
                           {/* Circuit lines */}
                           <div className="absolute inset-0 opacity-30">
                              <div className="absolute top-2 left-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                              <div className="absolute bottom-2 right-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                              <div className="absolute top-1/2 left-0 w-full h-px bg-purple-500/50"></div>
                              <div className="absolute left-1/2 top-0 w-px h-full bg-purple-500/50"></div>
                           </div>
                        </div>
                        <div className="px-3 py-1 bg-purple-950/50 border border-purple-500/30 rounded-full text-[10px] font-bold text-purple-400 tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                           SMART AI
                        </div>
                     </div>

                  </div>
               </div>

            </div>
         </section>

         {/* --- LIVE PAYOUTS TICKER --- */}
         <section className="bg-[#020205] border-t border-white/5 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-grid-flow"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-transparent to-[#020205]"></div>

            <div className="relative py-10 overflow-hidden z-20">
               <div className="absolute inset-0 bg-gradient-to-r from-[#020205] via-transparent to-[#020205] z-10 pointer-events-none"></div>
               <div className="flex gap-6 animate-marquee whitespace-nowrap">
                  {[...Array(10)].map((_, i) => (
                     <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full pl-2 pr-6 py-2 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg bg-gradient-to-br ${['from-purple-500 to-indigo-600', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-600', 'from-orange-500 to-red-500', 'from-pink-500 to-rose-500'][i % 5]
                           }`}>
                           {['MK', 'JD', 'AS', 'TR', 'PL'][i % 5]}
                        </div>
                        <div className="flex flex-col">
                           <div className="text-white text-sm font-bold flex items-center gap-1">
                              Just Paid <span className="text-emerald-400">₹{Math.floor(Math.random() * 800) + 100}</span>
                           </div>
                           <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">via UPI • {Math.floor(Math.random() * 59) + 1}m ago</span>
                        </div>
                     </div>
                  ))}
                  {[...Array(10)].map((_, i) => (
                     <div key={`dup-${i}`} className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full pl-2 pr-6 py-2 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg bg-gradient-to-br ${['from-purple-500 to-indigo-600', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-600', 'from-orange-500 to-red-500', 'from-pink-500 to-rose-500'][i % 5]
                           }`}>
                           {['MK', 'JD', 'AS', 'TR', 'PL'][i % 5]}
                        </div>
                        <div className="flex flex-col">
                           <div className="text-white text-sm font-bold flex items-center gap-1">
                              Just Paid <span className="text-emerald-400">₹{Math.floor(Math.random() * 800) + 100}</span>
                           </div>
                           <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">via UPI • {Math.floor(Math.random() * 59) + 1}m ago</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- STATS SECTION (REPLACES TELEMETRY) --- */}
         <section className="py-20 border-b border-white/5 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  <div className="space-y-2">
                     <div className="text-4xl md:text-5xl font-bold text-emerald-500">₹40M+</div>
                     <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Paid to Contributors</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-4xl md:text-5xl font-bold text-blue-500">50k+</div>
                     <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Users</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-4xl md:text-5xl font-bold text-purple-400">14</div>
                     <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Countries Supported</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-4xl md:text-5xl font-bold text-white">99.9%</div>
                     <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Platform Uptime</div>
                  </div>
               </div>
            </div>
         </section>

         {/* --- WHY STARSET / BENEFITS --- */}
         <section className="py-24 px-4 md:px-6 bg-zinc-50/50 dark:bg-black/40">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">Why Contribute?</h2>
                  <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto">The most flexible and rewarding way to join the AI economy.</p>
               </div>

               <div className="grid md:grid-cols-3 gap-8 md:gap-12 perspective-1000">
                  {[
                     {
                        icon: Smartphone,
                        color: "text-blue-500",
                        bg: "bg-blue-50 dark:bg-blue-900/10",
                        title: "Work Anywhere",
                        desc: "Your phone is your office. Complete tasks while commuting, waiting in line, or relaxing at home."
                     },
                     {
                        icon: Zap,
                        color: "text-amber-500",
                        bg: "bg-amber-50 dark:bg-amber-900/10",
                        title: "Instant Earnings",
                        desc: "Watch your balance grow in real-time. Withdraw funds immediately to your bank or wallet."
                     },
                     {
                        icon: ShieldCheck,
                        color: "text-emerald-500",
                        bg: "bg-emerald-50 dark:bg-emerald-900/10",
                        title: "Trusted Platform",
                        desc: "SOC2 certified. Trusted by 50,000+ contributors. Your data and privacy are our priority."
                     }
                  ].map((feature, idx) => (
                     <div key={idx} className="glass-card p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-5 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-10" style={{ color: feature.color.replace('text-', '') }}></div>
                        <div className={`h-16 w-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                           <feature.icon className={`h-8 w-8 ${feature.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{feature.title}</h3>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- TASKS SHOWCASE --- */}
         <section className="py-24 px-4 md:px-6 bg-white dark:bg-black border-y border-zinc-200 dark:border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                  <div>
                     <span className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-xs mb-3 block">Task Types</span>
                     <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">What Will You Do?</h2>
                  </div>
                  <Button onClick={() => onNavigate('contributors')} variant="outline" className="dark:text-white dark:border-white/20 w-full md:w-auto h-12 px-8">See All Tasks</Button>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Task Card 1 */}
                  <div className="group bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-3xl border border-zinc-200 dark:border-white/10 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2">
                     <div className="bg-white dark:bg-zinc-900 rounded-[22px] p-6 h-full flex flex-col">
                        <div className="h-48 bg-teal-50 dark:bg-teal-900/10 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent"></div>
                           <Mic className="h-16 w-16 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
                           <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/90 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-zinc-100 dark:border-white/10 backdrop-blur-sm">Avg: ₹150/hr</div>
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Audio Recording</h3>
                        <p className="text-zinc-500 mb-6 flex-1">Read short phrases or record conversations to help AI understand speech.</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                           <span className="px-3 py-1 bg-zinc-100 dark:bg-white/5 rounded-md text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10">Voice Assistant</span>
                        </div>
                     </div>
                  </div>

                  {/* Task Card 2 */}
                  <div className="group bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-3xl border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2">
                     <div className="bg-white dark:bg-zinc-900 rounded-[22px] p-6 h-full flex flex-col">
                        <div className="h-48 bg-purple-50 dark:bg-purple-900/10 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
                           <ImageIcon className="h-16 w-16 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
                           <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/90 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-zinc-100 dark:border-white/10 backdrop-blur-sm">Avg: ₹120/hr</div>
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Image Annotation</h3>
                        <p className="text-zinc-500 mb-6 flex-1">Draw boxes around objects or describe images to train computer vision.</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                           <span className="px-3 py-1 bg-zinc-100 dark:bg-white/5 rounded-md text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10">Self-Driving</span>
                        </div>
                     </div>
                  </div>

                  {/* Task Card 3 */}
                  <div className="group bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-3xl border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2">
                     <div className="bg-white dark:bg-zinc-900 rounded-[22px] p-6 h-full flex flex-col">
                        <div className="h-48 bg-blue-50 dark:bg-blue-900/10 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
                           <MessageSquare className="h-16 w-16 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
                           <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/90 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-zinc-100 dark:border-white/10 backdrop-blur-sm">Avg: ₹100/hr</div>
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Text & Logic</h3>
                        <p className="text-zinc-500 mb-6 flex-1">Rate chatbot responses, write creative stories, or solve logic puzzles.</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                           <span className="px-3 py-1 bg-zinc-100 dark:bg-white/5 rounded-md text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10">RLHF</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* --- HOW IT WORKS --- */}
         <section className="py-24 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">Start Earning in Minutes</h2>
                  <p className="text-xl text-zinc-500">No complex onboarding. Just create an account and go.</p>
               </div>

               <div className="grid md:grid-cols-4 gap-8 relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-1 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent -z-10"></div>

                  {[
                     { step: "01", title: "Sign Up", desc: "Create your free account using email or phone." },
                     { step: "02", title: "Select", desc: "Browse tasks that match your skills and language." },
                     { step: "03", title: "Execute", desc: "Follow the instructions and submit your work." },
                     { step: "04", title: "Get Paid", desc: "Earnings hit your wallet instantly after approval." }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center text-center bg-white dark:bg-black p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 rounded-full border-4 border-white dark:border-zinc-800 flex items-center justify-center text-2xl font-black text-zinc-900 dark:text-white shadow-lg mb-6 z-10">
                           {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{item.title}</h3>
                        <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>

               <div className="text-center mt-20">
                  <Button onClick={onStartSignup} size="lg" className="rounded-full px-12 h-16 text-xl bg-[#121212] dark:bg-white text-white dark:text-black hover:scale-105 transition-transform w-full md:w-auto shadow-2xl">Create Free Account</Button>
               </div>
            </div>
         </section>

         {/* --- COMMUNITY STORIES --- */}
         <section className="py-24 bg-[#050505] relative">
            <div className="max-w-7xl mx-auto px-6">
               <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">Community Stories</h2>
               <div className="grid md:grid-cols-3 gap-8">
                  {[
                     {
                        name: "Priya S.",
                        role: "Student, Bangalore",
                        quote: "I use Starset to pay for my college textbooks. It's flexible and the payments are super fast.",
                        initial: "P"
                     },
                     {
                        name: "Rahul M.",
                        role: "Professional, Mumbai",
                        quote: "The audio tasks are fun. I can do them while commuting to my main job. Great way to earn extra cash.",
                        initial: "R"
                     },
                     {
                        name: "Sarah J.",
                        role: "Freelancer, London",
                        quote: "I love the variety. One day I'm checking images, the next I'm writing creative stories for AI.",
                        initial: "S"
                     }
                  ].map((story, i) => (
                     <div key={i} className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex gap-1 text-amber-400 mb-6">
                           {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-zinc-300 text-lg mb-8 italic">"{story.quote}"</p>
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">
                              {story.initial}
                           </div>
                           <div>
                              <div className="text-white font-bold">{story.name}</div>
                              <div className="text-xs text-zinc-500">{story.role}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- FAQ SECTION --- */}
         <section className="py-24 bg-black relative">
            <div className="max-w-3xl mx-auto px-6">
               <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">Frequently Asked Questions</h2>
               <div className="space-y-4">
                  {[
                     { q: "Do I need any special skills?", a: "No special skills are required for most tasks. If you can speak, type, or identify objects in images, you can contribute. Some advanced tasks might require specific language proficiency." },
                     { q: "How much can I earn?", a: "Earnings depend on the complexity of tasks and your speed. Most contributors earn between ₹300-₹500 per hour of active work. Payments are listed upfront for every task." },
                     { q: "When do I get paid?", a: "We process payments daily. Once your work is validated (usually within 24 hours), you can withdraw funds immediately to your UPI or Bank Account." },
                     { q: "Is my data safe?", a: "Yes. We are SOC2 certified and prioritize data privacy. Your personal information is never shared with clients—only the anonymized data you explicitly contribute." }
                  ].map((faq, i) => (
                     <div key={i} className="bg-zinc-900/30 rounded-2xl border border-white/10 overflow-hidden">
                        <button
                           onClick={() => toggleFaq(i)}
                           className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-bold hover:bg-white/5 transition-colors"
                        >
                           {faq.q}
                           <ChevronDown className={`h-5 w-5 text-zinc-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === i && (
                           <div className="px-6 pb-6 text-zinc-400 leading-relaxed animate-in slide-in-from-top-2">
                              {faq.a}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- REDESIGNED CTA SECTION --- */}
         <section className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden bg-[#050505] perspective-1000">
            {/* Complex Dark Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="max-w-5xl mx-auto text-center relative z-10 transform-style-3d">
               <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-10 backdrop-blur-sm animate-float">
                  <TrendingUp className="h-5 w-5" /> HIGH DEMAND FOR NEW CONTRIBUTORS
               </div>

               <h2 className="text-5xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Digital Wallet</span> <br />
                  Is Waiting.
               </h2>

               <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed px-4">
                  Join the workforce of tomorrow. Start earning real money for simple digital tasks today. No interviews, no resume, just results.
               </p>

               <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                  <button
                     onClick={onStartSignup}
                     className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.2)] w-full sm:w-auto hover:shadow-[0_0_80px_rgba(255,255,255,0.4)]"
                  >
                     Start Earning Now
                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
                  </button>

                  <button onClick={() => onNavigate('money')} className="text-zinc-400 hover:text-white font-bold text-lg flex items-center gap-2 transition-colors hover:underline decoration-blue-500 underline-offset-4">
                     View Payment Rates <ArrowRight className="h-5 w-5" />
                  </button>
               </div>

               <div className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-zinc-500 font-mono">
                  <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div> INSTANT WITHDRAWAL</span>
                  <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div> SECURE SSL</span>
               </div>
            </div>
         </section>

      </PublicLayout>
   );
};