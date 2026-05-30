import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, Activity, Database, X, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { CookieConsent } from './CookieConsent';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';

export type PublicPageType = 'home' | 'about' | 'contributors' | 'money';

interface PublicLayoutProps {
   children: React.ReactNode;
   currentPage: PublicPageType;
   onNavigate: (page: PublicPageType) => void;
   onEnterApp: () => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
   children,
   currentPage,
   onNavigate,
   onEnterApp,
}) => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [showNav, setShowNav] = useState(true);
   const [isScrolled, setIsScrolled] = useState(false);
   const [lastScrollY, setLastScrollY] = useState(0);

   React.useEffect(() => {
      const handleScroll = () => {
         const currentScrollY = window.scrollY;

         // Determine if scrolled down (add background/blur)
         if (currentScrollY > 10) {
            setIsScrolled(true);
         } else {
            setIsScrolled(false);
         }

         // Determine scroll direction for hiding/showing
         if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past threshold -> hide
            setShowNav(false);
         } else {
            // Scrolling up -> show
            setShowNav(true);
         }

         setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
   }, [lastScrollY]);

   const navLinks: { name: string; id: PublicPageType }[] = [
      { name: 'Home', id: 'home' },
      { name: 'Contributors', id: 'contributors' },
      { name: 'Earning', id: 'money' },
      { name: 'About', id: 'about' },
   ];

   return (
      <div className="min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:bg-purple-500/30 dark:selection:text-purple-200 transition-colors duration-300">

         {/* Global Background Gradient & Grid - Across all public pages */}
         <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205]">
            {/* Main Blue Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#0a1d3a_0%,_transparent_70%),radial-gradient(circle_at_80%_70%,_#050b18_0%,_transparent_70%),#020205] opacity-100"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Animated Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></div>
         </div>

         {/* Navigation */}
         <nav
            className={`fixed top-0 w-full z-[100] transition-transform duration-300 ease-in-out bg-transparent pt-6
             ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
         >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between relative">

               {/* Left: Logo */}
               <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
                  <Logo className="h-10 w-10 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-extrabold text-lg md:text-xl tracking-[0.05em] text-slate-900 dark:text-white transition-colors uppercase whitespace-nowrap">Starset</span>
               </div>

               {/* Right: Floating Capsule (Desktop) */}
               <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl">
                  {/* Links */}
                  <div className="flex items-center pl-6 pr-4 gap-6">
                     {navLinks.map((item) => (
                        <button
                           key={item.id}
                           onClick={() => onNavigate(item.id)}
                           className={`text-[11px] font-black tracking-widest uppercase transition-all duration-200 ${currentPage === item.id ? 'text-blue-600 dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white'}`}
                        >
                           {item.name}
                        </button>
                     ))}
                  </div>

                  {/* Button */}
                  <Button onClick={onEnterApp} className="bg-blue-600 hover:bg-blue-700 !text-white !rounded-full px-7 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all text-[11px] font-black tracking-widest uppercase h-10 border-0">
                     Start Earning
                  </Button>

                  {/* Theme Toggle */}
                  <div className="ml-2 border-l border-white/10 pl-4 h-6 flex items-center">
                     <ThemeToggle className="!h-9 !w-9" />
                  </div>
               </div>

               {/* Right Actions (Mobile) */}
                <div className="flex items-center gap-2 md:gap-3 lg:hidden">
                  <ThemeToggle className="!h-9 !w-9" />
                  
                  <Button onClick={onEnterApp} size="sm" className="bg-blue-600 hover:bg-blue-700 !text-white !rounded-full px-4 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all text-xs font-bold h-9">
                     Start Earning
                  </Button>

                  <button
                     className="text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     aria-label="Toggle Menu"
                  >
                     {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
               </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
               <div className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-zinc-900/95 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl overflow-y-auto z-50">
                  <div className="flex flex-col gap-2">
                     <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2 opacity-60">Navigation</div>
                     {navLinks.map((item) => (
                        <button
                           key={item.id}
                           onClick={() => {
                              onNavigate(item.id);
                              setIsMobileMenuOpen(false);
                           }}
                           className={`text-3xl font-black text-left transition-all py-3 px-2 rounded-2xl ${currentPage === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-300 hover:bg-white/5'}`}
                        >
                           {item.name}
                        </button>
                     ))}
                  </div>
                  <div className="mt-auto pb-10">
                     <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2 opacity-60">Account System</div>
                     <Button onClick={() => { onEnterApp(); setIsMobileMenuOpen(false); }} className="w-full h-16 text-xl font-black rounded-2xl shadow-xl bg-white !text-black">
                        Access Terminal
                     </Button>
                  </div>
               </div>
            )}
         </nav>

         <main className="relative z-10 pt-20 min-h-[calc(100vh-80px)]">
            {children}
         </main>

         {/* Custom Premium Footer */}
         <Footer onNavigate={onNavigate} />
         <CookieConsent />
      </div >
   );
};