import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, Activity, Database, X, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { CookieConsent } from './CookieConsent';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';

// ── Per-page SEO configuration map ──
const SEO_CONFIG: Record<string, { title: string; description: string; keywords: string; canonicalPath: string }> = {
  home: {
    title: 'Starset Intelligence — Earn Money Daily by Training AI | starset.online',
    description: 'Starset Intelligence is the #1 platform to earn real money daily by completing AI training tasks. Join 10,000+ contributors. Data labeling, RLHF evaluation, creative writing. Instant payouts. Free to join.',
    keywords: 'Starset, starset.online, Starset Intelligence, earn money online, earn money daily, daily money, daily earning, AI tasks, AI jobs, AI opportunity, earn from home, data labeling jobs, RLHF, task earning, AI contributor, machine learning jobs, earn cash online, remote AI work, side hustle AI, train AI earn money, starset contributor, online earning platform, micro tasks, AI training platform, daily payout, star, starset ai, intelligence',
    canonicalPath: '/',
  },
  contributors: {
    title: 'Become a Contributor — Earn Money Training AI | Starset Intelligence',
    description: 'Join Starset Intelligence as a contributor. Complete AI data tasks, earn instant payouts. No experience needed. Work from anywhere. Flexible hours. Start earning money by training artificial intelligence models today.',
    keywords: 'AI contributor, become contributor, earn money AI, Starset contributor, data labeling contributor, RLHF contributor, work from home AI, remote AI jobs, flexible AI work, earn daily, starset.online contributor, money from tasks, daily earnings',
    canonicalPath: '/contributors',
  },
  money: {
    title: 'Earnings & Payouts — How to Earn Money on Starset Intelligence',
    description: 'Learn how much you can earn on Starset Intelligence. Instant payouts via UPI, bank transfer, and crypto. Contributors earn ₹200–₹2,000+ daily. Transparent earnings, no hidden fees.',
    keywords: 'earn money, daily earnings, AI earnings, Starset payouts, instant payout, UPI payout, earn money online, daily money, task earnings, how much earn Starset, AI task pay, earning platform, starset.online earnings, money from AI tasks',
    canonicalPath: '/money',
  },
  'task-types': {
    title: 'AI Task Types — RLHF, Data Labeling, Writing | Starset Intelligence',
    description: 'Explore all task types on Starset Intelligence. RLHF text evaluation, data labeling & tagging, creative writing, image classification, audio transcription. Tasks for every skill level.',
    keywords: 'AI tasks, RLHF tasks, data labeling, creative writing AI, image classification, audio transcription, task types, AI training tasks, Starset tasks, machine learning tasks, earn from tasks, starset.online tasks',
    canonicalPath: '/task-types',
  },
  about: {
    title: 'About Starset Intelligence — Our Mission to Train Better AI',
    description: 'Starset Intelligence connects human intelligence with the world\'s leading AI companies. Learn about our mission, how we work, and why thousands trust us to deliver high-quality AI training data.',
    keywords: 'about Starset, Starset Intelligence mission, AI data company, human-in-the-loop, AI training data, about starset.online, who is Starset, AI company India',
    canonicalPath: '/about',
  },
  careers: {
    title: 'Careers at Starset Intelligence — Join Our Team',
    description: 'Join the Starset Intelligence team. We are hiring engineers, AI researchers, and operations professionals to build the world\'s most advanced human-in-the-loop AI platform.',
    keywords: 'Starset careers, AI jobs, hiring AI engineers, Starset Intelligence jobs, work at Starset, AI startup jobs, remote AI career, starset.online careers',
    canonicalPath: '/careers',
  },
  blog: {
    title: 'Starset Blog — AI Insights, Updates & Industry News',
    description: 'Read the latest insights from Starset Intelligence. AI industry news, platform updates, contributor tips, RLHF research, and more from the frontlines of artificial intelligence.',
    keywords: 'Starset blog, AI blog, AI news, RLHF insights, AI industry, Starset updates, AI training news, machine learning blog, starset.online blog',
    canonicalPath: '/blog',
  },
  contact: {
    title: 'Contact Starset Intelligence — Get in Touch',
    description: 'Contact Starset Intelligence for support, partnerships, or general inquiries. Our team typically responds within 24 hours. Email us at support@starset.ai.',
    keywords: 'contact Starset, Starset support, starset.online contact, Starset Intelligence email, get help Starset, Starset customer support',
    canonicalPath: '/contact',
  },
  terms: {
    title: 'Terms of Service — Starset Intelligence',
    description: 'Read the Terms of Service for Starset Intelligence. Understand our platform rules, user agreements, and contributor guidelines.',
    keywords: 'terms of service, Starset terms, starset.online terms, legal, user agreement',
    canonicalPath: '/terms',
  },
  privacy: {
    title: 'Privacy Policy — Starset Intelligence',
    description: 'Starset Intelligence Privacy Policy. Learn how we collect, use, and protect your personal data. Your privacy matters to us.',
    keywords: 'privacy policy, Starset privacy, data protection, starset.online privacy, GDPR',
    canonicalPath: '/privacy',
  },
  cookies: {
    title: 'Cookie Policy — Starset Intelligence',
    description: 'Cookie Policy for Starset Intelligence. Learn about how we use cookies and tracking technologies on our platform.',
    keywords: 'cookie policy, Starset cookies, starset.online cookies, tracking policy',
    canonicalPath: '/cookies',
  },
  'data-processing': {
    title: 'Data Processing Agreement — Starset Intelligence',
    description: 'Data Processing Agreement for Starset Intelligence. Learn how contributor data is processed, stored, and protected.',
    keywords: 'data processing, DPA, Starset data, data agreement, starset.online data processing',
    canonicalPath: '/data-processing',
  },
  'language-directory': {
    title: 'Regional Indian Languages Directory — Starset Intelligence',
    description: 'Explore opportunities to train AI in Hindi, Tamil, Hinglish, Bengali, Telugu, English, and more regional Indian languages on Starset Intelligence. High payouts and flexible hours.',
    keywords: 'AI languages, train AI Hindi, regional Indian languages, Hinglish AI, Tamil AI jobs, Bengali AI tasks, Indian languages directory, Starset languages, English AI training',
    canonicalPath: '/language-directory',
  },
  'ai-training-guide': {
    title: 'How AI Models Are Trained — Educational Guide | Starset Intelligence',
    description: 'Learn how modern AI models like ChatGPT are trained using human data collection, supervised fine-tuning (SFT), and RLHF. A comprehensive guide by Starset Intelligence.',
    keywords: 'AI training guide, how AI is trained, RLHF explained, supervised fine-tuning, data annotation, AI learning, Starset educational guide, train AI models',
    canonicalPath: '/ai-training-guide',
  },
};

export type PublicPageType = 'home' | 'about' | 'contributors' | 'money' | 'terms' | 'privacy' | 'cookies' | 'data-processing' | 'task-types' | 'careers' | 'blog' | 'contact' | 'language-directory' | 'ai-training-guide';

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

   // Lock background body scroll when mobile menu is open
   React.useEffect(() => {
      if (isMobileMenuOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = '';
      }
      return () => {
         document.body.style.overflow = '';
      };
   }, [isMobileMenuOpen]);

   const navLinks: { name: string; id: PublicPageType; href: string }[] = [
      { name: 'Home', id: 'home', href: '/' },
      { name: 'Contributors', id: 'contributors', href: '/contributors' },
      { name: 'Earning', id: 'money', href: '/money' },
      { name: 'About', id: 'about', href: '/about' },
   ];

   // Helper: generates an onClick that prevents full reload but still navigates via SPA
   const navClick = (e: React.MouseEvent, page: PublicPageType) => {
      e.preventDefault();
      onNavigate(page);
   };

   const seo = SEO_CONFIG[currentPage] || SEO_CONFIG.home;

   return (
      <div className="min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:bg-purple-500/30 dark:selection:text-purple-200 transition-colors duration-300">
         <SEOHead
            title={seo.title}
            description={seo.description}
            keywords={seo.keywords}
            canonicalPath={seo.canonicalPath}
         />

         {/* Global Background Gradient & Grid - Across all public pages */}
         <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50 dark:bg-[#020205] transition-colors duration-300">
            {/* Main Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#f1f5f9_0%,_transparent_70%),radial-gradient(circle_at_80%_70%,_#f8fafc_0%,_transparent_70%),#f8fafc] dark:bg-[radial-gradient(circle_at_20%_30%,_#0a1d3a_0%,_transparent_70%),radial-gradient(circle_at_80%_70%,_#050b18_0%,_transparent_70%),#020205] opacity-100 transition-colors duration-300"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] transition-colors duration-300"></div>

            {/* Animated Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] transition-colors duration-300"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-[100px] transition-colors duration-300"></div>
            <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-sky-400/10 dark:bg-blue-500/5 rounded-full blur-[80px] transition-colors duration-300"></div>
         </div>

         {/* Navigation */}
         <nav
            className={`fixed top-0 w-full z-[100] transition-transform duration-300 ease-in-out bg-transparent pt-6
             ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
         >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between relative">

               {/* Left: Logo */}
               <a href="/" onClick={(e) => navClick(e, 'home')} className="flex items-center gap-2 md:gap-3 cursor-pointer group">
                  <Logo className="h-10 w-10 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-extrabold text-lg md:text-xl tracking-[0.05em] text-slate-900 dark:text-white transition-colors uppercase whitespace-nowrap">Starset</span>
               </a>

               {/* Right: Floating Capsule (Desktop) */}
               <div className="hidden lg:flex items-center bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full p-1.5 shadow-lg shadow-slate-200/50 dark:shadow-2xl">
                  {/* Links */}
                  <div className="flex items-center pl-4 pr-2 gap-2">
                     {navLinks.map((item) => (
                        <a
                           key={item.id}
                           href={item.href}
                           onClick={(e) => navClick(e, item.id)}
                           className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                              ${currentPage === item.id 
                                 ? 'bg-blue-600 !text-white shadow-md shadow-blue-500/25' 
                                 : '!text-slate-600 hover:!text-slate-900 dark:!text-zinc-400 dark:hover:!text-white !bg-transparent'}
                           `}
                        >
                           {item.name}
                        </a>
                     ))}
                  </div>

                  {/* Button */}
                  <a href="/login" onClick={(e) => { e.preventDefault(); onEnterApp(); }} className="ml-4 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 !text-white !rounded-full px-6 shadow-md shadow-blue-500/25 transition-all text-xs font-bold uppercase tracking-wider h-10 border-0">
                     Start Earning
                  </a>

                  {/* Theme Toggle */}
                  <div className="ml-3 border-l border-slate-200 dark:border-white/10 pl-3 h-6 flex items-center">
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
                     className="text-slate-900 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     aria-label="Toggle Menu"
                  >
                     {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
               </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
               <div className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-white dark:bg-zinc-900/95 backdrop-blur-3xl border-b border-slate-200 dark:border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl overflow-y-auto z-50">
                  <div className="flex flex-col gap-2">
                     <div className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2 opacity-60">Navigation</div>
                     {navLinks.map((item) => (
                        <a
                           key={item.id}
                           href={item.href}
                           onClick={(e) => {
                              navClick(e, item.id);
                              setIsMobileMenuOpen(false);
                           }}
                           className={`text-3xl font-black text-left transition-all py-3 px-2 rounded-2xl block ${
                              currentPage === item.id 
                                 ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 !opacity-100' 
                                 : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5'
                           }`}
                        >
                           {item.name}
                        </a>
                     ))}
                  </div>
                  <div className="mt-auto pb-10">
                     <div className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-2 opacity-60">Account System</div>
                     <Button 
                        onClick={() => { onEnterApp(); setIsMobileMenuOpen(false); }} 
                        variant="ghost"
                        className="w-full h-16 text-xl font-black rounded-2xl shadow-xl bg-slate-950 !text-white hover:bg-slate-900 dark:bg-white dark:!text-black dark:hover:bg-slate-100"
                     >
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