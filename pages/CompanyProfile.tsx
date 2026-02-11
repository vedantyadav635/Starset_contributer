import React from 'react';
import { Building2, Globe, Database, ShieldCheck, Heart } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const CompanyProfile: React.FC<PageProps> = ({ onNavigate, onEnterApp, isDark, toggleTheme }) => {
  return (
    <PublicLayout currentPage="profile" onNavigate={onNavigate} onEnterApp={onEnterApp} isDark={isDark} toggleTheme={toggleTheme}>
      <section className="py-24 px-6 bg-zinc-50/50 dark:bg-black border-b border-zinc-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
               <span className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-xs block">Who We Are</span>
               <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">Built for Trust. <br/>Built for You.</h1>
               <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Starset isn't just a tech company. We are a global community of people working together to build the future.
               </p>
               <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Since 2023, we've paid out millions to contributors in over 14 countries. We prioritize your privacy, your security, and your payments.
               </p>
               
               <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                    <Globe className="h-8 w-8 text-blue-500 mb-4" />
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">14+</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Countries</div>
                  </div>
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                    <Heart className="h-8 w-8 text-purple-500 mb-4" />
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">50k+</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Contributors</div>
                  </div>
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                    <ShieldCheck className="h-8 w-8 text-emerald-500 mb-4" />
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">100%</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Secure Data</div>
                  </div>
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                    <Building2 className="h-8 w-8 text-orange-500 mb-4" />
                    <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">24/7</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wide">Support</div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 p-10 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                  <div className="h-32 w-32 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                     <Building2 className="h-16 w-16 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Headquarters</h3>
                  <p className="text-zinc-500 text-lg mb-8">San Francisco, California</p>
                  <div className="w-full h-px bg-zinc-100 dark:bg-white/5 mb-8"></div>
                  <div className="grid grid-cols-1 gap-4 w-full text-sm">
                     <p className="text-zinc-500">
                        "We believe anyone, anywhere should be able to earn money by contributing to the AI revolution."
                     </p>
                  </div>
               </div>

               <div className="bg-blue-600 dark:bg-blue-900/30 p-8 rounded-2xl text-white">
                  <h3 className="font-bold text-xl mb-4">Need to check us out?</h3>
                  <p className="opacity-80 mb-6">Read our reviews or check our community forums to see what other contributors say.</p>
                  <a href="#" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">Visit Community</a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};