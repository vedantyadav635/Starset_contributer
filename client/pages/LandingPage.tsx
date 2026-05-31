import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ArrowRight, Activity, Database, Server, Zap, Globe, ShieldCheck, Lock, Smartphone, Banknote, Mic, Image as ImageIcon, MessageSquare, CheckCircle2, ChevronDown, Play, Star, TrendingUp, Users, Cpu, FileText, Sparkles, Brain, Network, MousePointer2 } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
   // Pipeline flow: each card triggers the next
   const cardBase = {
      hidden: { opacity: 0, y: 40, scale: 0.92, filter: 'blur(10px)' },
      visible: (i: number) => ({
         opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
         transition: {
            type: 'spring', stiffness: 260, damping: 22,
            delay: 0.15 + i * 0.35,
         },
      }),
   };

   return (
      <div className="relative w-full max-w-[600px] h-[560px] md:h-[540px] flex items-center justify-center">

         {/* Main pipeline container */}
         <motion.div
            className="relative w-full h-full flex flex-col justify-center items-center gap-6"
            initial="hidden"
            animate="visible"
         >
            {/* ─── CARD 1: Submit Task ─── */}
            <div className="relative flex items-center w-full justify-center">
               <motion.div
                  custom={0} variants={cardBase}
                  whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-[320px] md:w-80 bg-white dark:bg-blue-950/40 dark:backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-blue-500/20 shadow-xl shadow-slate-200/50 dark:shadow-[0_8px_30px_rgba(37,99,235,0.15)] z-10 cursor-pointer group hover:dark:border-blue-500/40 hover:dark:shadow-[0_8px_30px_rgba(37,99,235,0.25)] glass-shine"
               >
                  <div className="flex items-center gap-4 mb-4">
                     <motion.div
                        className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors"
                        whileHover={{ rotate: -8, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                     >
                        <Mic className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                     </motion.div>
                     <div>
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">New Task</div>
                        <div className="font-bold text-slate-900 dark:text-white">Audio Collection</div>
                     </div>
                  </div>
                  
                  <div className="flex items-end gap-1 h-8 mb-4">
                     {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.6, 0.9, 0.7].map((h, i) => (
                        <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           animate={{ height: ['' + (h * 100) + '%', '' + ((1 - h) * 100) + '%', '' + (h * 100) + '%'] }}
                           transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 + i * 0.08 }}
                           className="flex-1 bg-indigo-500/30 dark:bg-indigo-500/50 rounded-full"
                        />
                     ))}
                  </div>

                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500">Earn up to</span>
                     <motion.span
                        className="font-black text-slate-900 dark:text-white text-lg"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                     >₹85.00</motion.span>
                  </div>
               </motion.div>
            </div>

            {/* ─── CARD 2: Quality Check ─── */}
            <div className="relative flex items-center w-full justify-center">
               <motion.div
                  custom={1} variants={cardBase}
                  whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-[320px] md:w-80 bg-white/80 dark:bg-blue-950/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-blue-500/20 shadow-xl shadow-slate-200/50 dark:shadow-[0_8px_30px_rgba(37,99,235,0.15)] z-20 hover:dark:border-blue-500/40 hover:dark:shadow-[0_8px_30px_rgba(37,99,235,0.25)] glass-shine"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <motion.div
                           className="w-2 h-2 rounded-full bg-amber-500"
                           animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                           transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality Check</span>
                     </div>
                     <Cpu className="w-4 h-4 text-slate-400 animate-spin-slower" />
                  </div>
                  <div className="space-y-3">
                     <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.4 }}
                     >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                           <Network className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Quality Validation Active</div>
                     </motion.div>
                     <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.05, duration: 0.4 }}
                     >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                           <Brain className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Accuracy: 99.8%</div>
                     </motion.div>
                  </div>
               </motion.div>
            </div>

            {/* ─── CARD 3: Payment ─── */}
            <div className="relative flex items-center w-full justify-center">
               <motion.div
                  custom={2} variants={cardBase}
                  whileHover={{ y: -6, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-[320px] md:w-80 bg-white dark:bg-blue-950/40 dark:backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-emerald-500/20 shadow-xl shadow-slate-200/50 dark:shadow-[0_8px_30px_rgba(16,185,129,0.15)] z-10 cursor-pointer group hover:dark:border-emerald-500/40 hover:dark:shadow-[0_8px_30px_rgba(16,185,129,0.25)] glass-shine"
               >
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Payment Sent</span>
                     <motion.div
                        whileHover={{ rotate: 12, scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                     >
                        <Banknote className="w-5 h-5 text-emerald-500" />
                     </motion.div>
                  </div>
                  <motion.div
                     className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight"
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 18 }}
                  >₹1,240.50</motion.div>
                  <div className="text-[10px] text-slate-500 font-bold mb-4">AVAILABLE BALANCE</div>
                  <Button variant="black" className="w-full h-10 rounded-xl font-bold text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors btn-premium">
                     Withdraw to UPI
                  </Button>
               </motion.div>
            </div>

         </motion.div>
      </div>
   );
};;

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onStartSignup, onNavigate }) => {
   const [activeNodeCount, setActiveNodeCount] = useState(8432);
   const [openFaq, setOpenFaq] = useState<number | null>(null);

   const words = ["your daily tasks", "your audio", "your conversations", "your videos", "your camera roll"];
   const [wordIndex, setWordIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setWordIndex((prev) => (prev + 1) % words.length);
      }, 1800);
      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      // Only run live counter on desktop â€” avoids re-renders on mobile
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

         <section className="relative z-10 -mt-20 pt-36 pb-32 px-4 md:px-6 overflow-hidden bg-transparent dark:bg-transparent">
            {/* Luel Dotted Background (Mobile/Backup) */}
            <div className="absolute inset-0 bg-luel-dots opacity-40 -z-20 pointer-events-none lg:hidden transition-opacity"></div>
            
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-20">
               
               {/* Left Side Content */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-left relative z-20"
               >
                  <motion.h1 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.4 }}
                     className="text-[3.25rem] sm:text-6xl md:text-[5.5rem] font-black leading-[1.05] md:leading-[1.05] tracking-tighter mb-6 md:mb-8"
                  >
                     <span className="text-slate-900 dark:text-white">
                        Earn money from
                     </span>
                     <br />
                     <span className="relative inline-block">
                        <AnimatePresence mode="wait">
                           <motion.span
                              key={wordIndex}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 drop-shadow-md animate-shimmer"
                           >
                              {words[wordIndex]}
                           </motion.span>
                        </AnimatePresence>
                     </span>
                  </motion.h1>

                  <motion.p 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.5 }}
                     className="text-lg md:text-2xl font-medium text-slate-600 dark:text-zinc-300 max-w-xl mb-12 leading-relaxed"
                  >
                     Get paid for your everyday conversations, videos and photos. Join hundreds of thousands of contributors already earning with Starset.
                  </motion.p>

                  <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.8, delay: 0.6 }}
                     className="flex flex-col sm:flex-row items-center justify-start gap-4"
                  >
                     <Button 
                        onClick={() => onNavigate('signup')}
                        className="relative overflow-hidden group w-full sm:w-auto h-16 md:h-16 px-8 md:px-10 text-lg font-bold !text-white rounded-2xl shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.8)] transition-all duration-300 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-400/30 hover:-translate-y-1"
                     >
                        <span className="relative z-10 flex items-center shadow-sm text-white">
                           Start earning <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* 3D Inner Highlight */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                        {/* Sweep animation on hover */}
                        <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                     </Button>
                  </motion.div>
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
         <section className="py-14 md:py-20 relative overflow-hidden border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent">
            <div className="absolute inset-0 bg-transparent opacity-20"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 md:gap-y-12 md:gap-x-6 text-center">
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400">₹1K+</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Paid to Contributors</div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-black text-blue-600 dark:text-blue-400">99+</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Active Users</div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-black text-violet-600 dark:text-violet-400">14</div>
                     <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Countries Supported</div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white">99.9%</div>
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
                  <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 md:mb-6 tracking-tight">Why Contribute?</h2>
                  <p className="text-sm md:text-2xl text-zinc-500 max-w-3xl mx-auto">The most flexible and rewarding way to join the AI economy.</p>
               </div>

               <div className="flex overflow-x-auto pt-10 pb-6 gap-4 md:gap-6 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:grid md:grid-cols-3 md:gap-12 md:mx-0 md:px-0">
                  {[
                     {
                        icon: Smartphone,
                        color: "text-blue-600 dark:text-blue-400",
                        bg: "bg-blue-50 dark:bg-blue-900/10",
                        title: "Work Anywhere",
                        desc: "Your phone is your office. Complete tasks while commuting, waiting in line, or relaxing at home."
                     },
                     {
                        icon: Zap,
                        color: "text-amber-600 dark:text-amber-500",
                        bg: "bg-amber-50 dark:bg-amber-900/10",
                        title: "Instant Earnings",
                        desc: "Watch your balance grow in real-time. Withdraw funds immediately to your bank or wallet."
                     },
                     {
                        icon: ShieldCheck,
                        color: "text-emerald-600 dark:text-emerald-500",
                        bg: "bg-emerald-50 dark:bg-emerald-900/10",
                        title: "Trusted Platform",
                        desc: "SOC2 certified. Trusted by 50,000+ contributors. Your data and privacy are our priority."
                     }
                  ].map((feature, idx) => (
                     <div key={idx} className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-white/5 dark:to-white/5 backdrop-blur-md p-5 md:p-8 rounded-[32px] border border-blue-100/50 dark:border-white/10 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group md:hover:-translate-y-2 hover:shadow-xl shadow-lg shadow-slate-200/40 dark:shadow-none flex-shrink-0 w-[80vw] sm:w-[340px] md:w-auto snap-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] dark:opacity-5 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-10" style={{ color: feature.color.replace('text-', '') }}></div>
                        <div className={`h-12 w-12 md:h-16 md:w-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                           <feature.icon className={`h-5 w-5 md:h-8 md:w-8 ${feature.color}`} />
                        </div>
                        <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-4">{feature.title}</h3>
                        <p className="text-sm md:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
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
               <div className="flex flex-col items-center justify-center text-center mb-12 md:mb-20 gap-6">
                  <div className="max-w-2xl flex flex-col items-center">
                     <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-[10px] mb-3 block text-center">Task Types</span>
                     <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                        What Will <br className="md:hidden" /> You Do?
                     </h2>
                  </div>
                  <Button 
                     variant="outline"
                     onClick={() => onNavigate('contributors')} 
                     className="btn-pill h-12 md:h-14 px-8 border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 mt-2 md:mt-4"
                  >
                     See All Tasks
                  </Button>
               </div>

               <div className="flex overflow-x-auto pb-8 gap-4 md:gap-8 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:mx-0 md:px-0">
                  {[
                     {
                        title: "Audio Recording",
                        desc: "Read short phrases or record conversations to help AI understand speech across languages.",
                        icon: Mic,
                        color: "text-blue-500",
                        bg: "bg-blue-50 dark:bg-blue-900/10",
                        badge: "Voice Assistant",
                        price: "Avg: ₹150/hr"
                     },
                     {
                        title: "Image Annotation",
                        desc: "Draw boxes around objects or describe scenes to train computer vision for autonomous systems.",
                        icon: ImageIcon,
                        color: "text-indigo-500",
                        bg: "bg-indigo-50 dark:bg-indigo-900/10",
                        badge: "Self-Driving",
                        price: "Avg: ₹120/hr"
                     },
                     {
                        title: "Text & Logic",
                        desc: "Rate chatbot responses, write creative stories, or solve complex logic puzzles for LLMs.",
                        icon: FileText,
                        color: "text-violet-500",
                        bg: "bg-violet-50 dark:bg-violet-900/10",
                        badge: "RLHF",
                        price: "Avg: ₹100/hr"
                     }
                  ].map((task, idx) => (
                     <div key={idx} className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-white/5 dark:to-white/5 backdrop-blur-md p-5 md:p-8 rounded-[32px] border border-blue-100/50 dark:border-white/10 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group md:hover:-translate-y-2 hover:shadow-xl shadow-lg shadow-slate-200/40 dark:shadow-none cursor-pointer flex-shrink-0 w-[85vw] sm:w-[350px] md:w-auto snap-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] dark:opacity-[0.03] dark:opacity-5 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-10" style={{ color: task.color.replace('text-', '') }}></div>
                        
                        <div className="flex justify-between items-start mb-5 md:mb-8 relative z-10">
                           <div className={`h-12 w-12 md:h-16 md:w-16 ${task.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                              <task.icon className={`h-5 w-5 md:h-8 md:w-8 ${task.color}`} />
                           </div>
                           <div className="bg-slate-50 dark:bg-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white">
                              {task.price}
                           </div>
                        </div>

                        <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-tight relative z-10">{task.title}</h3>
                        <p className="text-sm md:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed mb-6 md:mb-8 relative z-10">{task.desc}</p>
                        
                        <div className="flex items-center gap-2 relative z-10">
                           <span className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest border border-slate-200 dark:border-white/5">
                              {task.badge}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
         </section>

         {/* --- HOW IT WORKS (CLEAN & MINIMAL) --- */}
         <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden bg-slate-50/50 dark:bg-zinc-950/50 border-y border-slate-200 dark:border-white/5">
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="max-w-7xl mx-auto relative z-10"
            >
               <div className="text-center mb-16 md:mb-24 px-2">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                     Start Earning in Minutes
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
                     No complex onboarding. Just create an account, select a task, and start contributing.
                  </p>
               </div>

               <div className="relative">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-slate-200 dark:bg-white/10 -z-10 rounded-full"></div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
                     {[
                        { 
                           step: "1", 
                           title: "Sign Up Free", 
                           desc: "Create your account using email or phone in under 30 seconds.",
                           icon: Sparkles,
                           color: "text-blue-600 dark:text-blue-400",
                           bg: "bg-blue-50 dark:bg-blue-500/10"
                        },
                        { 
                           step: "2", 
                           title: "Choose Tasks", 
                           desc: "Browse a variety of tasks that match your language and skills.",
                           icon: MousePointer2,
                           color: "text-indigo-600 dark:text-indigo-400",
                           bg: "bg-indigo-50 dark:bg-indigo-500/10"
                        },
                        { 
                           step: "3", 
                           title: "Execute", 
                           desc: "Follow simple instructions to record audio, tag images, or write text.",
                           icon: Activity,
                           color: "text-violet-600 dark:text-violet-400",
                           bg: "bg-violet-50 dark:bg-violet-500/10"
                        },
                        { 
                           step: "4", 
                           title: "Get Paid", 
                           desc: "Earnings are credited instantly upon validation. Withdraw immediately.",
                           icon: Banknote,
                           color: "text-emerald-600 dark:text-emerald-400",
                           bg: "bg-emerald-50 dark:bg-emerald-500/10"
                        }
                     ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                           {/* Icon Container */}
                           <div className="relative mb-6 md:mb-8">
                              <div className={`w-20 h-20 md:w-24 md:h-24 ${item.bg} rounded-[24px] flex items-center justify-center border border-white dark:border-white/5 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 relative z-10`}>
                                 <item.icon className={`h-8 w-8 md:h-10 md:w-10 ${item.color}`} />
                              </div>
                              {/* Step Badge */}
                              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-black shadow-md border-2 border-white dark:border-zinc-900 z-20">
                                 {item.step}
                              </div>
                           </div>

                           <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                           <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium px-4">
                              {item.desc}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="mt-16 md:mt-24 text-center">
                  <Button 
                     onClick={onStartSignup} 
                     className="btn-pill h-14 px-10 text-base font-bold bg-blue-600 hover:bg-blue-700 !text-white border-none shadow-lg shadow-blue-500/25"
                  >
                     Create Free Account
                  </Button>
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
               <h2 className="text-2xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-6 md:mb-16">Community Stories</h2>
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
                     <div key={i} className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 shadow-sm dark:shadow-none transition-colors flex-shrink-0 w-[82vw] sm:w-[350px] md:w-auto snap-center">
                        <div className="flex gap-1 text-amber-400 mb-3 md:mb-6">
                           {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-slate-600 dark:text-zinc-300 text-lg mb-8 italic leading-relaxed">"{story.quote}"</p>
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-900 dark:text-white font-bold shadow-sm dark:shadow-lg">
                              {story.initial}
                           </div>
                           <div>
                              <div className="text-slate-900 dark:text-white font-bold">{story.name}</div>
                              <div className="text-xs text-slate-500 dark:text-zinc-500">{story.role}</div>
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
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-slate-900 dark:text-white mb-10 md:mb-16 tracking-tight">Frequently Asked Questions</h2>
               <div className="space-y-3 md:space-y-4">
                  {[
                     { q: "Do I need any special skills?", a: "No special skills are required for most tasks. If you can speak, type, or identify objects in images, you can contribute. Some advanced tasks might require specific language proficiency." },
                     { q: "How much can I earn?", a: "Earnings depend on the complexity of tasks and your speed. Most contributors earn between ₹300-₹500 per hour of active work. Payments are listed upfront for every task." },
                     { q: "When do I get paid?", a: "We process payments daily. Once your work is validated (usually within 24 hours), you can withdraw funds immediately to your UPI or Bank Account." },
                     { q: "Is my data safe?", a: "Yes. We are SOC2 certified and prioritize data privacy. Your personal information is never shared with clients—only the anonymized data you explicitly contribute." }
                  ].map((faq, i) => (
                     <div key={i} className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-blue-500/30 shadow-sm dark:shadow-none transition-all">
                        <button
                           onClick={() => toggleFaq(i)}
                           className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex items-center justify-between text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm md:text-base gap-3"
                        >
                           <span>{faq.q}</span>
                           <ChevronDown className={`h-5 w-5 text-slate-400 dark:text-zinc-500 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === i && (
                           <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-slate-600 dark:text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
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
                  <span className="text-xs font-black text-slate-600 dark:text-zinc-400 tracking-tight uppercase">High demand for new contributors</span>
               </div>

               <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">
                  <span className="text-slate-900 dark:text-white">Your </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">Digital Wallet</span>
                  <br className="hidden md:block" />
                  <span className="text-slate-900 dark:text-white"> Will Thank You</span>
               </h2>

               <p className="text-base md:text-2xl text-slate-500 dark:text-zinc-400 mb-14 max-w-2xl mx-auto leading-relaxed px-4 font-medium">
                  Join the workforce of tomorrow. Start earning real money for simple digital tasks today. No interviews, no resume, just results.
               </p>

               <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
                  <Button
                     variant="black"
                     onClick={onStartSignup}
                     className="btn-pill w-full sm:w-auto h-16 md:h-24 px-10 md:px-16 text-lg md:text-2xl hover:scale-105 transition-transform shadow-2xl shadow-slate-900/20 dark:shadow-white/10"
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
