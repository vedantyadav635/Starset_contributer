import React from 'react';
import { Rocket, Target, Users, Zap } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface PageProps {
   onNavigate: (page: PublicPageType) => void;
   onEnterApp: () => void;
}

export const Careers: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
   return (
      <PublicLayout currentPage="careers" onNavigate={onNavigate} onEnterApp={onEnterApp}>
         <section className="py-24 px-6 relative overflow-hidden min-h-[80vh]">
            <div className="max-w-7xl mx-auto">
               <div className="mb-16 text-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 block">Join Our Team</span>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
                     <span className="text-slate-900 dark:text-white">Build the future of </span>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">AI Infrastructure</span>
                  </h1>
                  <p className="text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto text-xl leading-relaxed">
                     We are a fast-growing team of engineers, researchers, and operators building the world's most advanced human-in-the-loop platform. Help us shape the next generation of artificial intelligence.
                  </p>
               </div>

               <div className="max-w-4xl mx-auto mt-16 bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-white/10 p-10 md:p-16 text-center">
                  <Rocket className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">We are currently hiring!</h2>
                  <p className="text-slate-600 dark:text-zinc-400 text-lg mb-8">
                     While we aren't displaying open positions publicly just yet, we're always looking for exceptional talent in Engineering, AI Research, and Operations.
                  </p>
                  <a href="mailto:careers@starset.ai" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25">
                     Email our recruiting team
                  </a>
               </div>
            </div>
         </section>
      </PublicLayout>
   );
};
