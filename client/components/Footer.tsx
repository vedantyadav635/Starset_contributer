import React, { useEffect, useRef } from 'react';
import { PublicPageType } from './PublicLayout';
import { Logo } from './Logo';
import { Mail, Linkedin, Twitter, Github, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface FooterProps {
  onNavigate: (page: PublicPageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#020205] z-10">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top CTA Section */}
        <div className="flex flex-col md:flex-row justify-between items-center p-10 md:p-14 mb-20 rounded-[32px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 border border-blue-100 dark:border-white/10 relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-500/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          
          <div className="max-w-xl text-center md:text-left relative z-10 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Ready to start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer">journey?</span>
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-lg">
              Join thousands of contributors earning money daily by training the world's most advanced AI models.
            </p>
          </div>
          
          <div className="relative z-10 flex w-full md:w-auto">
            <Button onClick={() => onNavigate('signup')} variant="primary" size="lg" className="w-full md:w-auto flex items-center justify-center gap-3">
              Become a Contributor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => onNavigate('home')}>
              <Logo className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">STARSET</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-sm">
              The premier platform connecting human intelligence with the next generation of artificial intelligence. Smarter tasks, faster payouts.
            </p>
            
            {/* Socials */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-white hover:bg-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-white hover:bg-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-white hover:bg-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-white hover:bg-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Columns */}
          <div className="md:col-span-7 flex flex-wrap md:flex-nowrap justify-between md:justify-around gap-10">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-2 opacity-80">Platform</h4>
              <button onClick={() => onNavigate('home')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Home</button>
              <button onClick={() => onNavigate('contributors')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Contributors</button>
              <button onClick={() => onNavigate('money')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Earnings</button>
              <button className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Task Types</button>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-2 opacity-80">Company</h4>
              <button onClick={() => onNavigate('about')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">About Us</button>
              <button className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Careers</button>
              <button className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Blog</button>
              <button className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Contact</button>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-2 opacity-80">Legal</h4>
              <button onClick={() => onNavigate('terms')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Terms of Service</button>
              <button onClick={() => onNavigate('privacy')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Privacy Policy</button>
              <button onClick={() => onNavigate('cookies')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Cookie Policy</button>
              <button onClick={() => onNavigate('data-processing')} className="text-left text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Data Processing</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-slate-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Starset Intelligence. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-zinc-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              All systems operational
            </span>
          </div>
        </div>
      </div>
      
      {/* Massive subtle watermark */}
      <div className="w-full overflow-hidden flex justify-center pointer-events-none select-none absolute bottom-0 left-0 right-0 z-0 opacity-20 dark:opacity-[0.03]">
        <h1 className="text-[15vw] leading-none font-black text-slate-300 dark:text-white whitespace-nowrap translate-y-1/3">
          STARSET
        </h1>
      </div>
    </footer>
  );
};
