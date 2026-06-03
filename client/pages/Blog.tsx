import React from 'react';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface PageProps {
   onNavigate: (page: PublicPageType) => void;
   onEnterApp: () => void;
}

export const Blog: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
   return (
      <PublicLayout currentPage="blog" onNavigate={onNavigate} onEnterApp={onEnterApp}>
         <section className="py-24 px-6 relative overflow-hidden min-h-[80vh]">
            <div className="max-w-7xl mx-auto">
               <div className="mb-16 text-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 block">Latest Updates</span>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
                     <span className="text-slate-900 dark:text-white">Insights from the </span>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">Frontlines of AI</span>
                  </h1>
               </div>

               <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
                  {/* Blog Post 1 */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden group cursor-pointer hover:border-blue-500/50 transition-colors">
                     <div className="h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
                     </div>
                     <div className="p-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500 mb-4">
                           <Calendar className="h-4 w-4" />
                           May 24, 2026
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                           The Importance of Human Context in LLM Training
                        </h3>
                        <p className="text-slate-600 dark:text-zinc-400 mb-6 line-clamp-3">
                           Why automated synthetic data isn't enough to build safe, aligned, and truly intelligent models. Exploring the methodology behind RLHF.
                        </p>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 text-sm">
                           Read full article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                  </div>

                  {/* Blog Post 2 */}
                  <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden group cursor-pointer hover:border-blue-500/50 transition-colors">
                     <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-emerald-500 opacity-50" />
                     </div>
                     <div className="p-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500 mb-4">
                           <Calendar className="h-4 w-4" />
                           May 10, 2026
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                           Starset Payouts: New Crypto Options Added
                        </h3>
                        <p className="text-slate-600 dark:text-zinc-400 mb-6 line-clamp-3">
                           We are excited to announce expanded global payout options for all contributors. Instantly withdraw your earnings in USDC alongside standard fiat options.
                        </p>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 text-sm">
                           Read full article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </PublicLayout>
   );
};
