import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, Activity, Database, X, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { CookieConsent } from './CookieConsent';

export type PublicPageType = 'home' | 'about' | 'contributors' | 'money' | 'cookies';

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
      { name: 'About', id: 'about' },
      { name: 'Contributors', id: 'contributors' },
      { name: 'Money', id: 'money' },
   ];

   return (
      <div className="min-h-screen text-zinc-900 dark:text-white font-sans selection:bg-purple-500/30 selection:text-purple-200 transition-colors duration-300">

         {/* Global Background Gradient & Grid - Across all public pages */}
         <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205]">
            {/* Main Blue Gradient Background - More Seamless */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#0a1d3a_0%,_transparent_70%),radial-gradient(circle_at_80%_70%,_#050b18_0%,_transparent_70%),#020205] opacity-90"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Animated Glows - Blue Focused */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] "></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] -glow"></div>
            <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></div>
         </div>

         {/* Navigation */}
         <nav
            className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out
             ${showNav ? 'translate-y-0' : '-translate-y-full'}
             ${isScrolled ? 'bg-transparent backdrop-blur-2xl' : 'bg-transparent backdrop-blur-none'}`}
         >
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

               {/* Logo Section */}
               <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
                  <Logo className="h-12 w-12 md:h-16 md:w-16" />
                  <span className="font-bold text-base md:text-lg tracking-[0.1em] text-zinc-900 dark:text-white transition-colors font-mono uppercase whitespace-nowrap">Starset</span>
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
               <div className="flex items-center gap-2 md:gap-3">
                  <Button onClick={onEnterApp} size="sm" variant="glow" className="rounded-full px-3 md:px-6 shadow-none hover:shadow-lg transition-all text-[10px] md:text-sm h-8 md:h-10">
                     Start Earning
                  </Button>

                  <button
                     className="lg:hidden text-zinc-900 dark:text-white p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     aria-label="Toggle Menu"
                  >
                     {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
               </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
               <div className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl border-b border-zinc-200 dark:border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl overflow-y-auto z-50">
                  <div className="flex flex-col gap-2">
                     <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2 opacity-60">Navigation</div>
                     {navLinks.map((item) => (
                        <button
                           key={item.id}
                           onClick={() => {
                              onNavigate(item.id);
                              setIsMobileMenuOpen(false);
                           }}
                           className={`text-3xl font-black text-left transition-all py-3 px-2 rounded-2xl ${currentPage === item.id ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                           {item.name}
                        </button>
                     ))}
                  </div>
                  <div className="mt-auto pb-10">
                     <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2 opacity-60">Account System</div>
                     <Button onClick={() => { onEnterApp(); setIsMobileMenuOpen(false); }} className="w-full h-16 text-xl font-black rounded-2xl shadow-xl bg-zinc-900 dark:bg-white !text-white dark:!text-black">
                        Access Terminal
                     </Button>
                  </div>
               </div>
            )}
         </nav>

         <main className="relative z-10 pt-20 min-h-[calc(100vh-80px)]">
            {children}
         </main>

         {/* Professional Footer */}
         <footer className="pt-20 pb-10 px-6 relative z-10 border-t border-white/5 bg-[#020205]/40 backdrop-blur-xl mt-20">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                  {/* Brand & Mission */}
                  <div className="md:col-span-1 space-y-4">
                     <div className="flex items-center gap-2 mb-4">
                        <Logo className="h-10 w-10" />
                        <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-lg">Starset</span>
                     </div>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                        Connecting real people with the world's smartest AI companies. Turn your spare time into income.
                     </p>
                     <div className="flex gap-4 pt-2">
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                           <Twitter className="h-4 w-4" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                           <Github className="h-4 w-4" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                           <Linkedin className="h-4 w-4" />
                        </a>
                     </div>
                  </div>

                  {/* Navigation */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-zinc-900 dark:text-white mb-4 hidden md:block">Platform</h3>
                     <ul className="space-y-3">
                        {navLinks.map((item) => (
                           <li key={item.id}>
                              <button
                                 onClick={() => onNavigate(item.id)}
                                 className="text-sm text-zinc-500 hover:text-blue-500 transition-colors"
                              >
                                 {item.name}
                              </button>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Legal */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-zinc-900 dark:text-white mb-4 hidden md:block">Legal</h3>
                     <ul className="space-y-3">
                        <li><a href="#" className="text-sm text-zinc-500 hover:text-blue-500 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="text-sm text-zinc-500 hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                        <li><button onClick={() => onNavigate('cookies')} className="text-sm text-zinc-500 hover:text-blue-500 transition-colors">Cookie Policy</button></li>
                        <li><a href="#" className="text-sm text-zinc-500 hover:text-blue-500 transition-colors">Acceptable Use</a></li>
                     </ul>
                  </div>

                  {/* Help & Support */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-zinc-900 dark:text-white mb-4 hidden md:block">Contact</h3>
                     <ul className="space-y-3">
                        <li><a href="#" className="text-sm text-zinc-500 hover:text-blue-500 transition-colors flex items-center gap-2"><Mail className="h-4 w-4" /> support@starset.ai</a></li>
                        <li><a href="#" className="text-sm text-zinc-500 hover:text-blue-500 transition-colors">Help Center</a></li>
                        <li><a href="#" className="text-sm text-zinc-500 hover:text-blue-500 transition-colors">Community Discord</a></li>
                        <li className="pt-2">
                           <Button onClick={onEnterApp} variant="outline" size="sm" className="w-full justify-center bg-transparent border-white/10 hover:bg-white/5">
                              Login to Terminal
                           </Button>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Bottom Bar */}
               <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                  <p>&copy; {new Date().getFullYear()} Starset Inc. All rights reserved.</p>
               </div>
            </div>
         </footer>
         <CookieConsent />
      </div >
   );
};