import React from 'react';
import { Network, Code2, Layers, ShieldCheck, Sparkles, Brain } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const About: React.FC<PageProps> = ({ onNavigate, onEnterApp, isDark, toggleTheme }) => {
  return (
    <PublicLayout currentPage="about" onNavigate={onNavigate} onEnterApp={onEnterApp} isDark={isDark} toggleTheme={toggleTheme}>
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="mb-16 text-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 block">Our Story</span>
              <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">Humans Teaching Machines</h1>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto text-xl leading-relaxed">
                 AI isn't magic—it learns from people like you. Starset connects real people with the world's smartest AI companies. You provide the knowledge, and the AI gets smarter.
              </p>
           </div>

           <div className="grid lg:grid-cols-3 gap-8 mt-20">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-white/10 relative group hover:-translate-y-2 transition-transform duration-300">
                 <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 border border-blue-100 dark:border-blue-900/30">
                    <Network className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">We Connect You</h3>
                 <p className="text-sm text-zinc-500 leading-relaxed">
                    We bring tasks from big tech companies directly to your screen. No middleman, just direct work.
                 </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-white/10 relative group hover:-translate-y-2 transition-transform duration-300">
                 <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 border border-purple-100 dark:border-purple-900/30">
                    <Brain className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">You Teach AI</h3>
                 <p className="text-sm text-zinc-500 leading-relaxed">
                    Every voice clip you record or image you label helps AI understand the human world better.
                 </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-white/10 relative group hover:-translate-y-2 transition-transform duration-300">
                 <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-100 dark:border-emerald-900/30">
                    <Sparkles className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Better Future</h3>
                 <p className="text-sm text-zinc-500 leading-relaxed">
                    By providing accurate data, you help create safer, more useful, and less biased technology.
                 </p>
              </div>
           </div>

           <div className="mt-24 bg-zinc-50 dark:bg-white/5 rounded-3xl p-12 border border-zinc-200 dark:border-white/5">
              <h2 className="text-2xl font-bold mb-8 text-center">What You'll Be Working On</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {['Teaching Chatbots', 'Voice Recognition', 'Identifying Images', 'Rating AI Responses', 'Translating Text', 'Safety Checks'].map((cap) => (
                    <div key={cap} className="flex items-center gap-3 p-4 bg-white dark:bg-black/40 rounded-lg border border-zinc-200 dark:border-white/10 shadow-sm">
                       <ShieldCheck className="h-5 w-5 text-emerald-500" />
                       <span className="font-medium text-zinc-700 dark:text-zinc-200">{cap}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>
    </PublicLayout>
  );
};