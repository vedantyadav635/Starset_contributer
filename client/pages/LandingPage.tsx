import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, Activity, Database, Server, Zap, Globe, ShieldCheck, Lock, Smartphone, Banknote, Mic, Image as ImageIcon, MessageSquare, CheckCircle2, ChevronDown, Play, Star, TrendingUp, Users, Cpu, FileText, Sparkles, Brain, Network, MousePointer2 } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LandingPageProps {
   onEnterApp: () => void;
   onStartSignup: () => void;
   onNavigate: (page: PublicPageType) => void;
}

// Decorative Sparkle Component
const Sparkle = ({ className }: { className?: string }) => (
   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
   </svg>
);

const EcosystemVisual = () => {
   return (
      <div className="relative w-full max-w-[600px] h-[500px] flex items-center justify-center">
         {/* Background World Map Graphic (Simplified dots) */}
         <div className="absolute inset-0 opacity-20 dark:opacity-40 mask-fade-out">
            <svg viewBox="0 0 800 400" className="w-full h-full text-slate-300 dark:text-zinc-700">
               <circle cx="200" cy="150" r="2" fill="currentColor" />
               <circle cx="300" cy="180" r="2" fill="currentColor" />
               <circle cx="450" cy="120" r="2" fill="currentColor" />
               <circle cx="600" cy="220" r="2" fill="currentColor" />
               <circle cx="150" cy="280" r="2" fill="currentColor" />
               <circle cx="550" cy="100" r="2" fill="currentColor" />
            </svg>
         </div>

         {/* Neural Merge Connection Lines - Hidden on Mobile */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden md:block">
            <motion.path 
               d="M 180 180 Q 300 250 400 300" 
               stroke="url(#pulseGradient)" 
               strokeWidth="2" 
               fill="none"
               strokeDasharray="10 10"
               animate={{ strokeDashoffset: [0, -100] }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="opacity-40"
            />
            <defs>
               <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
               </linearGradient>
            </defs>
         </svg>

         {/* Floating Cards Stack */}
         <div className="relative w-full h-full flex flex-col justify-center items-center gap-6 perspective-1000">
            
            {/* Card 1: Audio Task */}
            <motion.div
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               whileHover={{ y: -5, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full max-w-[320px] md:w-80 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-luel z-10 md:-rotate-3 md:hover:rotate-0 transition-transform cursor-pointer group"
            >
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                     <Mic className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">New Task</div>
                     <div className="font-bold text-slate-900 dark:text-white">Audio Collection</div>
                  </div>
               </div>
               
               <div className="flex items-end gap-1 h-8 mb-4">
                  {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.6, 0.9, 0.7].map((h, i) => (
                     <motion.div 
                        key={i}
                        animate={{ height: [`${h * 100}%`, `${(1-h) * 100}%`, `${h * 100}%`] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="flex-1 bg-indigo-500/30 dark:bg-indigo-500/50 rounded-full"
                     />
                  ))}
               </div>

               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Earn up to</span>
                  <span className="font-black text-slate-900 dark:text-white text-lg">₹85.00</span>
               </div>
            </motion.div>

            {/* Card 2: Processing (Middle) */}
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="w-full max-w-[320px] md:w-80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-luel z-20"
            >
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Processing</span>
                  </div>
                  <Cpu className="w-4 h-4 text-slate-400 animate-spin-slow" />
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                        <Network className="w-4 h-4 text-indigo-500" />
                     </div>
                     <div className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Model Learning In Progress</div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-blue-500" />
                     </div>
                     <div className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Accuracy Verified: 99.8%</div>
                  </div>
               </div>
            </motion.div>

            {/* Card 3: Payment (Bottom Right) */}
            <motion.div
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               whileHover={{ y: 5, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full max-w-[320px] md:w-80 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-luel z-10 md:rotate-3 md:hover:rotate-0 transition-transform cursor-pointer group"
            >
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Payment Sent</span>
                  <Banknote className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
               </div>
               <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">₹1,240.50</div>
               <div className="text-[10px] text-slate-500 font-bold mb-4">AVAILABLE BALANCE</div>
               <Button className="w-full h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Withdraw to UPI
               </Button>
            </motion.div>

         </div>
      </div>
   );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onStartSignup, onNavigate }) => {
   const [activeNodeCount, setActiveNodeCount] = useState(8432);
   const [openFaq, setOpenFaq] = useState<number | null>(null);

   useEffect(() => {
      // Only run live counter on desktop — avoids re-renders on mobile
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) return;

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
      <PublicLayout currentPage="home" onNavigate={onNavigate} onEnterApp={onEnterApp}>

         {/* --- PREMIUM 3D BACKGROUND (Desktop Only) --- */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
            {/* 3D Abstract Image with Parallax */}
            <motion.div 
               style={{ 
                  backgroundImage: 'url("/premium_3d_bg.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  scale: 1.1
               }}
               animate={{ 
                  rotateX: [0, 1, -1, 0],
                  rotateY: [0, -1, 1, 0],
               }}
               transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
               }}
               className="absolute inset-0 opacity-40 dark:opacity-30 blur-[1px]"
            />

            {/* Deep Perspective Grid */}
            <div className="absolute inset-0 [perspective:1000px]">
               <div className="absolute inset-0 bg-luel-dots opacity-20 [transform:rotateX(60deg)_translateZ(-200px)_scale(2)]" />
            </div>

            {/* Cinematic Lighting */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-50 dark:from-[#020205] to-transparent" />
         </div>

         <section className="relative z-10 -mt-20 pt-36 pb-32 px-4 md:px-6 overflow-hidden">
            {/* Luel Dotted Background (Mobile/Backup) */}
            <div className="absolute inset-0 bg-luel-dots opacity-40 -z-20 pointer-events-none lg:hidden"></div>
            
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-20">
               
               {/* Left Side Content */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-center lg:text-left"
               >
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-sm mb-10">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-xs font-black text-slate-600 dark:text-zinc-400 tracking-tight">
                        {activeNodeCount.toLocaleString()} contributors earning live today
                     </span>
                  </div>

                  <motion.h1 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.4 }}
                     className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1] md:leading-[0.95] tracking-tighter mb-8"
                  >
                     <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block"
                     >
                        Earn cash.
                     </motion.span>
                     <br className="hidden md:block" />
                     <motion.span 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent animate-gradient-swipe drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                     >
                        Teach AI.
                     </motion.span>
                  </motion.h1>

                  <motion.p 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.5 }}
                     className="text-base md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4"
                  >
                     Join the world's most innovative data community. Turn your daily moments into valuable training data for the next generation of intelligence.
                  </motion.p>

                  <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.6 }}
                     className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4"
                  >
                     <Button 
                        onClick={() => onNavigate('signup')}
                        className="btn-pill w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-base md:text-xl bg-blue-600 hover:bg-blue-700 !text-white border-none flex items-center justify-center"
                     >
                        Start Contributing
                     </Button>
                     <Button 
                        variant="outline"
                        className="btn-pill w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-base md:text-xl border-2 border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center"
                     >
                        How it Works
                     </Button>
                  </motion.div>

                  {/* Trust Badges */}
                  <div className="mt-16 pt-10 border-t border-slate-200 dark:border-white/5 flex flex-wrap justify-center lg:justify-start gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
                     <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                        <ShieldCheck className="h-5 w-5" /> SOC2 COMPLIANT
                     </div>
                     <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                        <Lock className="h-5 w-5" /> 256-BIT SECURE
                     </div>
                     <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                        <Globe className="h-5 w-5" /> GLOBAL ACCESS
                     </div>
                  </div>
               </motion.div>

               {/* Right Side Visual */}
               <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative flex items-center justify-center lg:justify-end"
               >
                  <EcosystemVisual />
               </motion.div>

            </div>
         </section>



         {/* --- STATS SECTION (REPLACES TELEMETRY) --- */}
         <section className="py-14 md:py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-transparent opacity-20"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 md:gap-y-12 md:gap-x-6 text-center">
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-indigo-500">₹1K+</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Paid to Contributors</div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-500">99+</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Active Users</div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-purple-400">14</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Countries Supported</div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">99.9%</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Platform Uptime</div>
                  </div>
               </div>
            </div>
         </section>

         {/* --- WHY STARSET / BENEFITS --- */}
         <section className="py-8 md:py-24 px-4 md:px-6 relative">
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="max-w-7xl mx-auto"
            >
               <div className="text-center mb-6 md:mb-20 px-2">
                  <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-2 md:mb-6 tracking-tight">Why Contribute?</h2>
                  <p className="text-sm md:text-2xl text-zinc-500 max-w-3xl mx-auto">The most flexible and rewarding way to join the AI economy.</p>
               </div>

               <div className="flex overflow-x-auto pt-10 pb-6 gap-4 md:gap-6 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:grid md:grid-cols-3 md:gap-12 md:mx-0 md:px-0">
                  {[
                     {
                        icon: Smartphone,
                        color: "text-blue-400",
                        bg: "bg-blue-900/10",
                        title: "Work Anywhere",
                        desc: "Your phone is your office. Complete tasks while commuting, waiting in line, or relaxing at home."
                     },
                     {
                        icon: Zap,
                        color: "text-amber-500",
                        bg: "bg-amber-900/10",
                        title: "Instant Earnings",
                        desc: "Watch your balance grow in real-time. Withdraw funds immediately to your bank or wallet."
                     },
                     {
                        icon: ShieldCheck,
                        color: "text-emerald-500",
                        bg: "bg-emerald-900/10",
                        title: "Trusted Platform",
                        desc: "SOC2 certified. Trusted by 50,000+ contributors. Your data and privacy are our priority."
                     }
                  ].map((feature, idx) => (
                     <div key={idx} className="bg-white/5 backdrop-blur-md p-5 md:p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group md:hover:-translate-y-2 hover:shadow-2xl flex-shrink-0 w-[80vw] sm:w-[340px] md:w-auto snap-center shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-5 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-10" style={{ color: feature.color.replace('text-', '') }}></div>
                        <div className={`h-12 w-12 md:h-16 md:w-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                           <feature.icon className={`h-5 w-5 md:h-8 md:w-8 ${feature.color}`} />
                        </div>
                        <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4">{feature.title}</h3>
                        <p className="text-sm md:text-lg text-zinc-400 leading-relaxed">{feature.desc}</p>
                     </div>
                  ))}
               </div>
            </motion.div>
         </section>

         {/* --- TASKS SHOWCASE --- */}
         <section className="py-8 md:py-24 px-4 md:px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-transparent opacity-50 pointer-events-none"></div>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="max-w-7xl mx-auto relative z-10"
            >
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
                  <div className="max-w-2xl">
                     <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-[10px] mb-3 block">Contributor Journey</span>
                     <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                        What Will <br className="md:hidden" /> You Do?
                     </h2>
                  </div>
                  <Button 
                     variant="outline"
                     onClick={() => onNavigate('contributors')} 
                     className="btn-pill h-12 md:h-14 px-8 border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                     Explore All Tasks
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Task Card 1: Audio */}
                  <motion.div 
                     whileHover={{ y: -5 }}
                     className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/10 shadow-luel group cursor-pointer"
                  >
                     <div className="h-56 bg-slate-50 dark:bg-zinc-950 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-luel-dots opacity-20"></div>
                        
                        {/* Audio Waveform Animation */}
                        <div className="flex items-end gap-1 h-12">
                           {[...Array(8)].map((_, i) => (
                              <motion.div
                                 key={i}
                                 animate={{ 
                                    height: [10, Math.random() * 40 + 10, 10]
                                 }}
                                 transition={{ 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    delay: i * 0.1 
                                 }}
                                 className="w-1.5 bg-blue-500 rounded-full"
                              />
                           ))}
                        </div>

                        <div className="absolute top-4 right-4 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white">
                           Avg: ₹150/hr
                        </div>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Audio Recording</h3>
                     <p className="text-base text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
                        Read short phrases or record conversations to help AI understand speech across languages.
                     </p>
                     <div className="flex items-center gap-2">
                        <span className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest border border-slate-100 dark:border-white/5">
                           Voice Assistant
                        </span>
                     </div>
                  </motion.div>

                  {/* Task Card 2: Image */}
                  <motion.div 
                     whileHover={{ y: -5 }}
                     className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/10 shadow-luel group cursor-pointer"
                  >
                     <div className="h-56 bg-slate-50 dark:bg-zinc-950 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-luel-dots opacity-20"></div>
                        
                        {/* Bounding Box Visual */}
                        <div className="relative w-24 h-24 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-lg">
                           <motion.div 
                              animate={{ 
                                 top: ["10%", "50%", "20%"],
                                 left: ["10%", "30%", "60%"],
                                 width: ["40%", "60%", "30%"],
                                 height: ["30%", "20%", "50%"]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute bg-indigo-500/20 border border-indigo-500 rounded-sm"
                           />
                           <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500/40" />
                        </div>

                        <div className="absolute top-4 right-4 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white">
                           Avg: ₹120/hr
                        </div>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Image Annotation</h3>
                     <p className="text-base text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
                        Draw boxes around objects or describe scenes to train computer vision for autonomous systems.
                     </p>
                     <div className="flex items-center gap-2">
                        <span className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest border border-slate-100 dark:border-white/5">
                           Self-Driving
                        </span>
                     </div>
                  </motion.div>

                  {/* Task Card 3: Text */}
                  <motion.div 
                     whileHover={{ y: -5 }}
                     className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/10 shadow-luel group cursor-pointer"
                  >
                     <div className="h-56 bg-slate-50 dark:bg-zinc-950 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-luel-dots opacity-20"></div>
                        
                        {/* Typing Animation Visual */}
                        <div className="w-32 space-y-2">
                           <motion.div animate={{ width: ["40%", "100%", "60%"] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 bg-violet-500/30 rounded-full" />
                           <motion.div animate={{ width: ["80%", "30%", "90%"] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="h-1.5 bg-violet-500/50 rounded-full" />
                           <motion.div animate={{ width: ["20%", "70%", "40%"] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="h-1.5 bg-violet-500/20 rounded-full" />
                        </div>

                        <div className="absolute top-4 right-4 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white">
                           Avg: ₹100/hr
                        </div>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Text & Logic</h3>
                     <p className="text-base text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
                        Rate chatbot responses, write creative stories, or solve complex logic puzzles for LLMs.
                     </p>
                     <div className="flex items-center gap-2">
                        <span className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest border border-slate-100 dark:border-white/5">
                           RLHF
                        </span>
                     </div>
                  </motion.div>
               </div>
            </motion.div>
         </section>

         {/* --- HOW IT WORKS --- */}
         <section className="py-8 md:py-24 px-4 md:px-6 overflow-hidden relative">
            {/* Background Elements — desktop only */}
            <div className="hidden md:block absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="max-w-7xl mx-auto relative z-10"
            >
               <div className="text-center mb-6 md:mb-20 px-2">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-6">Start Earning in Minutes</h2>
                  <p className="text-sm md:text-xl text-zinc-500">No complex onboarding. Just create an account and go.</p>
               </div>

               <div className="flex overflow-x-auto pt-10 pb-6 gap-3 md:gap-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:grid md:grid-cols-4 md:mx-0 md:px-0 relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[1px] bg-blue-500/10 -z-10"></div>

                  {[
                     { step: "01", title: "Sign Up", desc: "Create your free account using email or phone." },
                     { step: "02", title: "Select", desc: "Browse tasks that match your skills and language." },
                     { step: "03", title: "Execute", desc: "Follow the instructions and submit your work." },
                     { step: "04", title: "Get Paid", desc: "Earnings hit your wallet instantly after approval." }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center text-center bg-white/5 backdrop-blur-md p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 hover:-translate-y-2 transition-transform duration-300 flex-shrink-0 w-[58vw] sm:w-[240px] md:w-auto snap-center">
                        <div className="h-11 w-11 md:h-20 md:w-20 bg-blue-500/10 rounded-full border-2 md:border-4 border-blue-500/20 flex items-center justify-center text-base md:text-2xl font-black text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-3 md:mb-6 z-10">
                           {item.step}
                        </div>
                        <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-3">{item.title}</h3>
                        <p className="text-xs md:text-base text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                  ))}
               </div>

               <div className="hidden md:block text-center mt-6 md:mt-20 px-4">
                  <Button onClick={onStartSignup} size="lg" className="rounded-full px-8 md:px-12 h-12 md:h-16 text-base md:text-xl bg-white text-black hover:scale-105 transition-transform w-full md:w-auto shadow-2xl">Create Free Account</Button>
               </div>
            </motion.div>
         </section>

         {/* --- COMMUNITY STORIES --- */}
         <section className="py-8 md:py-24 relative">
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="max-w-7xl mx-auto px-6"
            >
               <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-6 md:mb-16">Community Stories</h2>
               <div className="flex overflow-x-auto pb-2 md:pb-8 gap-4 md:gap-6 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:grid md:grid-cols-3 md:mx-0 md:px-0">
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
                     <div key={i} className="bg-white/5 backdrop-blur-md p-5 md:p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors flex-shrink-0 w-[82vw] sm:w-[350px] md:w-auto snap-center">
                        <div className="flex gap-1 text-amber-400 mb-3 md:mb-6">
                           {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-zinc-300 text-lg mb-8 italic leading-relaxed">"{story.quote}"</p>
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shadow-lg">
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
            </motion.div>
         </section>

         {/* --- FAQ SECTION --- */}
         <section className="py-16 md:py-24 relative">
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="max-w-3xl mx-auto px-4 md:px-6"
            >
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-white mb-10 md:mb-16 tracking-tight">Frequently Asked Questions</h2>
               <div className="space-y-3 md:space-y-4">
                  {[
                     { q: "Do I need any special skills?", a: "No special skills are required for most tasks. If you can speak, type, or identify objects in images, you can contribute. Some advanced tasks might require specific language proficiency." },
                     { q: "How much can I earn?", a: "Earnings depend on the complexity of tasks and your speed. Most contributors earn between ₹300-₹500 per hour of active work. Payments are listed upfront for every task." },
                     { q: "When do I get paid?", a: "We process payments daily. Once your work is validated (usually within 24 hours), you can withdraw funds immediately to your UPI or Bank Account." },
                     { q: "Is my data safe?", a: "Yes. We are SOC2 certified and prioritize data privacy. Your personal information is never shared with clients—only the anonymized data you explicitly contribute." }
                  ].map((faq, i) => (
                     <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all">
                        <button
                           onClick={() => toggleFaq(i)}
                           className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex items-center justify-between text-white font-bold hover:bg-white/5 transition-colors text-sm md:text-base gap-3"
                        >
                           <span>{faq.q}</span>
                           <ChevronDown className={`h-5 w-5 text-zinc-500 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === i && (
                           <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                              {faq.a}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </motion.div>
         </section>

         {/* --- REDESIGNED CTA SECTION --- */}
         <section className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden">
            {/* Luel Dotted Background for consistency */}
            <div className="absolute inset-0 bg-luel-dots opacity-20 -z-20 pointer-events-none"></div>
            
            {/* CTA Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="max-w-5xl mx-auto text-center relative z-10"
            >
               <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 shadow-sm mb-12 backdrop-blur-md">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black text-slate-600 dark:text-zinc-400 tracking-tight uppercase">High demand for contributors</span>
               </div>

               <h2 className="text-4xl md:text-8xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter leading-[0.95] md:leading-[0.9]">
                  Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Digital Wallet</span> <br className="hidden md:block" />
                  Is Waiting.
               </h2>

               <p className="text-base md:text-2xl text-slate-500 dark:text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed px-4 font-medium">
                  Join the workforce of tomorrow. Start earning real money for simple digital tasks today. No interviews, no resume, just results.
               </p>

               <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
                  <Button
                     onClick={onStartSignup}
                     className="btn-pill w-full sm:w-auto h-16 md:h-24 px-10 md:px-16 text-lg md:text-2xl bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform shadow-2xl shadow-slate-900/20 dark:shadow-white/10"
                  >
                     Start Earning Now
                  </Button>

                  <button 
                     onClick={() => onNavigate('money')} 
                     className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white font-black text-base md:text-xl flex items-center gap-2 transition-all hover:translate-x-1 py-3 group"
                  >
                     View Payouts 
                     <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>

               {/* Decorative floating elements for engagement */}
               <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-bounce hidden md:block" />
               <div className="absolute -bottom-20 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse hidden md:block" />
            </motion.div>
         </section>
      </PublicLayout>
   );
};
