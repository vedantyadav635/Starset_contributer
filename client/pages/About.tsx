import React from 'react';
import { Network, Code2, Layers, ShieldCheck, Sparkles, Brain } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface PageProps {
   onNavigate: (page: PublicPageType) => void;
   onEnterApp: () => void;
}

export const About: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
   return (
      <PublicLayout currentPage="about" onNavigate={onNavigate} onEnterApp={onEnterApp}>
         <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
               <div className="mb-16 text-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 block">Our Story</span>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
                     <span className="text-slate-900 dark:text-white">Humans Teaching </span>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">Machines</span>
                  </h1>
                  <p className="text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto text-xl leading-relaxed">
                     AI isn't magic—it learns from people like you. Starset connects real people with the world's smartest AI companies. You provide the knowledge, and the AI gets smarter. 
                  </p>
               </div>

               <div className="grid lg:grid-cols-3 gap-8 mt-20">
                  <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 relative group hover:-translate-y-2 transition-all duration-300">
                     <div className="h-14 w-14 bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-400 mb-8 border border-blue-900/30 group-hover:scale-110 transition-transform">
                        <Network className="h-7 w-7" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">We Connect You</h3>
                     <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                        We bring high-paying tasks from industry-leading AI labs directly to you. No intermediaries—just clear, impactful work.
                     </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 relative group hover:-translate-y-2 transition-all duration-300">
                     <div className="h-14 w-14 bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-400 mb-8 border border-purple-900/30 group-hover:scale-110 transition-transform">
                        <Brain className="h-7 w-7" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">You Teach AI</h3>
                     <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                        Every task you complete, from complex reasoning to creative input, helps distill human wisdom into machine intelligence.
                     </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 relative group hover:-translate-y-2 transition-all duration-300">
                     <div className="h-14 w-14 bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-900/30 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-7 w-7" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Better Future</h3>
                     <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                        High-quality data ensures AI is safe, unbiased, and capable. Your contributions shape the next era of technology.
                     </p>
                  </div>
               </div>

               <div className="mt-24 bg-slate-50 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 border border-slate-200 dark:border-white/5 shadow-inner">
                  <h2 className="text-3xl font-black mb-12 text-center text-slate-900 dark:text-white tracking-tight">What You'll Be Working On</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {['Teaching Chatbots', 'Voice Recognition', 'Identifying Images', 'Rating AI Responses', 'Translating Text', 'Safety Checks'].map((cap) => (
                        <div key={cap} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-900 transition-colors group">
                           <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                              <ShieldCheck className="h-5 w-5 text-emerald-500" />
                           </div>
                           <span className="font-bold text-slate-700 dark:text-zinc-200 text-sm md:text-base">{cap}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      </PublicLayout>
   );
};
