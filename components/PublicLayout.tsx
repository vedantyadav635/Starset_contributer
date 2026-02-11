import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Moon, Sun, Menu, Activity, Database, X } from 'lucide-react';

export type PublicPageType = 'home' | 'about' | 'contributors' | 'money';

interface PublicLayoutProps {
  children: React.ReactNode;
  currentPage: PublicPageType;
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate, 
  onEnterApp, 
  isDark,
  toggleTheme 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { name: string; id: PublicPageType }[] = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Contributors', id: 'contributors' },
    { name: 'Money', id: 'money' },
  ];

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden transition-colors duration-300">
      
      {/* Global Background Grid & Stars */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-flow"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-zinc-200/50 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <Logo className="h-9 w-9 text-blue-600 dark:text-blue-500 relative z-10 transition-transform duration-500" />
            </div>
            <span className="font-bold text-lg tracking-[0.1em] text-zinc-900 dark:text-white transition-colors font-mono uppercase whitespace-nowrap">Starset</span>
          </div>
          
          {/* Desktop Center Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
               <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${currentPage === item.id ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
               >
                  {item.name}
               </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
               {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="h-4 w-px bg-zinc-300 dark:bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-3">
               <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 <span className="tracking-wider">OPERATIONAL</span>
               </div>

               <Button onClick={onEnterApp} size="sm" variant={isDark ? "glow" : "black"} className="rounded-full px-4 md:px-6 shadow-none hover:shadow-lg transition-all text-xs md:text-sm">
                 Start Earning
               </Button>
            </div>

            <button 
               className="lg:hidden text-zinc-900 dark:text-white p-1"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
           <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-200 shadow-xl overflow-y-auto z-50">
               {navLinks.map((item) => (
                  <button 
                     key={item.id}
                     onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                     }}
                     className={`text-2xl font-bold text-left transition-colors py-2 border-b border-zinc-100 dark:border-white/5 ${currentPage === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-300'}`}
                  >
                     {item.name}
                  </button>
               ))}
               <div className="mt-auto pb-10">
                   <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Account</div>
                   <Button onClick={() => { onEnterApp(); setIsMobileMenuOpen(false); }} className="w-full h-12 text-lg">
                      Log In / Sign Up
                   </Button>
               </div>
           </div>
        )}
      </nav>

      <main className="relative z-10 pt-20 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      <footer className="border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-black pt-16 pb-8 px-6 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <Logo className="h-4 w-4 text-zinc-900 dark:text-white" />
               <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Starset</span>
            </div>
            <div className="flex gap-8">
               <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
               <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Contact Support</span>
            </div>
         </div>
      </footer>
    </div>
  );
};