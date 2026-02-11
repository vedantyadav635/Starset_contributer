import React from 'react';
import { Banknote, Wallet, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Money: React.FC<PageProps> = ({ onNavigate, onEnterApp, isDark, toggleTheme }) => {
  return (
    <PublicLayout currentPage="money" onNavigate={onNavigate} onEnterApp={onEnterApp} isDark={isDark} toggleTheme={toggleTheme}>
      <section className="py-24 px-6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2 block">Your Earnings</span>
              <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-4">
                Get Paid Fast
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-xl">
                We know you work hard. That's why we make getting paid simple, transparent, and quick.
              </p>
            </div>
            <Button onClick={onEnterApp} size="lg" className="h-14 px-8 text-lg">
              Start Earning Now
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-emerald-500/50 transition-colors group">
              <div className="h-14 w-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Banknote className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Great Rates</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We pay competitively for every task. Difficult tasks pay more. You always see the price upfront.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-colors group">
              <div className="h-14 w-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Zap className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Quick Withdrawals</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Don't wait weeks for your money. Withdraw your approved earnings within 24 hours to your preferred account.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-purple-500/50 transition-colors group">
              <div className="h-14 w-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <TrendingUp className="h-7 w-7 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Quality Bonuses</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Do good work, get paid more. Top-rated contributors unlock higher-paying tasks and special bonuses.
              </p>
            </div>
          </div>

          <div className="bg-[#1c1917] dark:bg-zinc-900 rounded-3xl p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                   <h2 className="text-3xl font-bold mb-6">How We Pay You</h2>
                   <p className="text-zinc-400 mb-6 text-lg">We support payment methods that work for you, wherever you are.</p>
                   <ul className="space-y-4">
                      {['Direct Bank Transfer', 'UPI (Instant Transfer)', 'PayPal', 'Crypto (USDC)'].map((method) => (
                         <li key={method} className="flex items-center gap-3 text-lg text-zinc-300">
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" /> {method}
                         </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                   <div className="flex justify-between items-center mb-8">
                      <span className="text-sm font-mono text-zinc-400">LIVE EARNINGS STATS</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-2"><div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div> ACTIVE</span>
                   </div>
                   <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                         <div>
                            <div className="text-sm text-zinc-400 mb-1">Average Pay Per Hour</div>
                            <div className="text-2xl font-bold">₹350 - ₹500</div>
                         </div>
                         <div className="text-sm text-emerald-400 font-bold">High Demand</div>
                      </div>
                      <div className="flex justify-between items-end">
                         <div>
                            <div className="text-sm text-zinc-400 mb-1">Top Monthly Earner</div>
                            <div className="text-2xl font-bold">₹1,42,000</div>
                         </div>
                         <div className="text-sm text-emerald-400">Elite Level</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};