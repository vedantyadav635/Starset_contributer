import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { LANGUAGES_DIRECTORY } from './LandingPage';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

export const LanguageDirectory: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'north' | 'south' | 'hinglish'>('all');

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout
      currentPage="language-directory"
      onNavigate={onNavigate}
      onEnterApp={onEnterApp}
    >
      <div className="relative overflow-hidden min-h-screen py-16 md:py-24">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Navigation */}
          <div className="mb-8 md:mb-12">
            <button
              onClick={() => onNavigate('home' as any)}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-black bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 tracking-wider uppercase mb-4 inline-block">
              Full Languages Directory
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              AI Training Opportunities
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Explore our complete directory of regional language projects. Choose your dialect, qualify for tasks, and start earning by training AI models.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/5 max-w-full">
              {(['all', 'north', 'south', 'hinglish'] as const).map((cat) => {
                const label = {
                  all: "All Languages",
                  north: "North India",
                  south: "South India",
                  hinglish: "Conversational / Hinglish"
                }[cat];
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.2)]"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Layout of All Language Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {LANGUAGES_DIRECTORY.filter(lang => selectedCategory === 'all' || lang.category === selectedCategory).map((lang) => (
              <motion.div
                key={lang.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => onNavigate('signup')}
                className="group relative flex flex-col justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-500/30 shadow-sm md:shadow-md hover:shadow-xl shadow-slate-100 dark:shadow-none md:hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                {/* Popular Badge */}
                {lang.popular && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black tracking-wider uppercase bg-amber-50/80 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                    Hot
                  </div>
                )}

                <div className="space-y-2 md:space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-lg md:text-xl uppercase group-hover:scale-110 transition-transform shrink-0">
                      {lang.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-xl font-extrabold text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 leading-tight md:leading-normal">
                        {lang.name}
                        <span className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-zinc-400">
                          ({lang.nativeName})
                        </span>
                      </h3>
                      <p className="hidden md:block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">
                        {lang.category === 'hinglish' ? 'Conversational' : lang.category === 'north' ? 'North Dialects' : 'South Dialects'}
                      </p>
                    </div>
                  </div>

                  <div className="py-1 md:py-2 md:space-y-2">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-0.5">
                      <span className="text-[9px] md:text-xs text-slate-400 dark:text-zinc-500 font-medium">Payout Rate</span>
                      <span className="text-sm md:text-lg font-black text-emerald-600 dark:text-emerald-400">{lang.payout}</span>
                    </div>
                    {lang.payoutBonus && (
                      <div className="hidden md:block text-[10px] text-right font-semibold text-amber-600 dark:text-amber-400">
                        {lang.payoutBonus}
                      </div>
                    )}
                  </div>

                  {/* Hidden on Mobile to save space */}
                  <div className="hidden md:block space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Supported Dialects</h4>
                      <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{lang.dialects}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Active Tasks</h4>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {lang.tasks.map((task, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-8">
                  <div
                    className="w-full h-8 md:h-12 flex items-center justify-center font-bold text-[10px] md:text-sm bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white dark:group-hover:text-white transition-all duration-300 rounded-lg md:rounded-xl shadow-inner group-hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.4)]"
                  >
                    Contribute
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
