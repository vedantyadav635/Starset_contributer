import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, Activity, Database, X } from 'lucide-react';

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
      { name: 'About', id: 'about' },
      { name: 'Contributors', id: 'contributors' },
      { name: 'Money', id: 'money' },
   ];

   return (
      <div className="min-h-screen text-zinc-900 dark:text-white font-sans selection:bg-purple-500/30 selection:text-purple-200 transition-colors duration-300">

         {/* Global Background Gradient & Grid - Only on Home */}
         {currentPage === 'home' ? (
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205]">
               {/* Main Blue Gradient Background - More Seamless */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#0a1d3a_0%,_transparent_70%),radial-gradient(circle_at_80%_70%,_#050b18_0%,_transparent_70%),#020205] opacity-90"></div>

               {/* Grid Pattern */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>

               {/* Animated Glows - Blue Focused */}
               <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
               <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-glow"></div>
               <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]"></div>
            </div>
         ) : (
            <div className="fixed inset-0 z-0 pointer-events-none bg-white dark:bg-[#050505]"></div>
         )}

         {/* Navigation */}
         <nav
            className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out
             ${showNav ? 'translate-y-0' : '-translate-y-full'}
             ${currentPage === 'home'
                  ? (isScrolled ? 'bg-transparent backdrop-blur-2xl' : 'bg-transparent backdrop-blur-none')
                  : (isScrolled ? 'border-b border-zinc-200/50 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl' : 'bg-transparent shadow-none')
               }`}
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

         {/* Footer - Restoration of border for non-home pages */}
         <footer className={`${currentPage === 'home' ? '' : 'border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#050505]'} pt-16 pb-8 px-6 relative z-10`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
               <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <Logo className="h-12 w-12" />
                  <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Starset</span>
               </div>
               <div className="flex gap-8">
                  <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                  <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                  <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors">Contact Support</span>
               </div>
            </div>
         </footer>
      </div >
   );
};