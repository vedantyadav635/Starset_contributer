import React from 'react';
import { Banknote, Wallet, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

export const Money: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  return (
    <PublicLayout currentPage="money" onNavigate={onNavigate} onEnterApp={onEnterApp}>
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div>
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2 block">Your Earnings</span>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-tight">
                <span className="text-slate-900 dark:text-white">Get Paid </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">Fast</span>
              </h1>
              <p className="text-slate-600 dark:text-zinc-400 max-w-2xl text-xl">
                We know you work hard. That's why we make getting paid simple, transparent, and quick.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-all group hover:-translate-y-2 shadow-sm dark:shadow-none">
              <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                <Banknote className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Great Rates</h3>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                We pay competitively for every task. Difficult tasks pay more. You always see the price upfront with no hidden fees.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all group hover:-translate-y-2 shadow-sm dark:shadow-none">
              <div className="h-14 w-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                <Zap className="h-7 w-7 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Quick Withdrawals</h3>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Don't wait weeks for your money. Withdraw your approved earnings within 24 hours directly to your preferred account.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all group hover:-translate-y-2 shadow-sm dark:shadow-none">
              <div className="h-14 w-14 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors">
                <TrendingUp className="h-7 w-7 text-purple-600 dark:text-purple-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Quality Bonuses</h3>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                Do good work, get paid more. Top-rated contributors unlock higher-paying tasks and exclusive weekly bonuses.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] p-12 text-slate-900 dark:text-white relative overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5">
            <div className="absolute top-0 right-0 p-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white">How We Pay You</h2>
                <p className="text-slate-500 dark:text-zinc-400 mb-10 text-xl font-medium">We support payment methods that work for you, wherever you are.</p>
                <ul className="space-y-6">
                  {['Direct Bank Transfer', 'UPI (Instant Transfer)', 'PayPal', 'Crypto (USDC)'].map((method) => (
                    <li key={method} className="flex items-center gap-4 text-xl font-bold text-slate-700 dark:text-zinc-200">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                      </div>
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-10 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-inner">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">LIVE EARNINGS STATS</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 text-sm"><div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> ACTIVE</span>
                </div>
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-6">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zinc-500 font-bold mb-2 uppercase tracking-wider">Average Pay Per Hour</div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white">₹50 - ₹100</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-zinc-500 font-bold mb-2 uppercase tracking-wider">Top Monthly Earner</div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white">₹1,05,000</div>
                    </div>
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
