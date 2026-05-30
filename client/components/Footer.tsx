import React, { useEffect, useRef } from 'react';
import { PublicPageType } from './PublicLayout';

interface FooterProps {
  onNavigate: (page: PublicPageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const textRef = useRef<SVGTextElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fit watermark SVG box on load and resize
  useEffect(() => {
    const fitWatermark = () => {
      if (textRef.current && svgRef.current) {
        try {
          const bbox = textRef.current.getBBox();
          svgRef.current.setAttribute(
            'viewBox',
            `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
          );
        } catch (e) {
          // Ignore if getBBox fails initially
        }
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWatermark);
    } else {
      window.addEventListener('load', fitWatermark);
    }
    window.addEventListener('resize', fitWatermark);

    // Initial timeout as a fallback for some browsers
    const t = setTimeout(fitWatermark, 100);

    return () => {
      window.removeEventListener('resize', fitWatermark);
      window.removeEventListener('load', fitWatermark);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <style>{`
        .font-dm-sans { font-family: 'DM Sans', sans-serif; }
        .font-caveat { font-family: 'Caveat', cursive; }
      `}</style>
      <section className="relative w-full pt-16 pb-12 px-6 bg-transparent overflow-hidden mt-12 z-20">
        <div className="max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 items-stretch relative z-10">
          
          {/* Left Card - Video Background */}
          <div className="relative min-h-[340px] rounded-[28px] p-8 overflow-hidden flex flex-col justify-between shadow-[0_12px_40px_rgba(21,76,189,0.25)] bg-[#1e4fc0]">
            <video 
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4" type="video/mp4" />
            </video>

            {/* Logo */}
            <div className="flex gap-2.5 relative z-10 items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-white/15 border-[1.5px] border-white/85 flex items-center justify-center">
                <span className="font-dm-sans font-bold text-white text-base tracking-[-0.02em]">S</span>
              </div>
              <span className="font-dm-sans font-bold text-[22px] text-white tracking-[-0.02em]">Starset</span>
            </div>

            {/* Tagline */}
            <div className="mt-auto mb-7 relative z-10">
              <p className="font-dm-sans text-[19px] font-normal text-white leading-[1.45]">
                Smarter micro-tasks,<br/>
                <span className="text-white/65">powered by AI.</span>
              </p>
            </div>

            {/* Social Row */}
            <div className="flex justify-between items-center gap-3 relative z-10">
              <span className="font-caveat text-[17px] font-semibold text-white/90 tracking-[0.3px]">Stay in touch!</span>
              <div className="flex gap-[7px]">
                {/* Social Icons */}
                {['M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
                 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'].map((path, i) => (
                  <a href="#" key={i} className="w-9 h-9 rounded-[9px] bg-[#0e1014] flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:bg-black hover:-translate-y-0.5 transition-all duration-200">
                    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-white">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-[#f0f1f5] dark:bg-white/5 rounded-[28px] p-10 relative flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            
            {/* Floating Lucky Badge */}
            <div className="absolute -top-9 right-10 z-10 flex flex-col items-start gap-1.5">
              <div className="w-24 h-24 rounded-[22px] -rotate-12 bg-gradient-to-br from-[#5b9ffb] via-[#1e5dd7] to-[#1448be] flex items-center justify-center shadow-[inset_3px_3px_8px_rgba(255,255,255,0.35),inset_-3px_-3px_12px_rgba(0,0,0,0.18),8px_14px_28px_rgba(20,72,200,0.35)]">
                <span className="font-dm-sans text-[42px] font-bold text-white tracking-[-0.04em] rotate-12 drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)] leading-none">S</span>
              </div>
              <div className="flex gap-1.5 items-center -rotate-3 mt-1">
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#9ca3af] fill-none stroke-2 stroke-round">
                  <path d="M3 20 C 6 14, 10 9, 18 5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 5 L 12 5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 5 L 18 11" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-caveat text-[20px] font-semibold text-[#9ca3af] whitespace-nowrap">Feeling lucky?</span>
              </div>
            </div>

            {/* Top Row - Navigation */}
            <div className="flex gap-[72px] pt-2">
              <div className="flex flex-col">
                <h3 className="font-caveat text-[24px] font-semibold italic text-[#9ca3af] mb-[18px]">Navigation</h3>
                <button onClick={() => onNavigate('home')} className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">How it works</button>
                <button onClick={() => onNavigate('contributors')} className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">Features</button>
                <button onClick={() => onNavigate('money')} className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">Earnings</button>
                <button className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">FAQ</button>
              </div>
              <div className="flex flex-col">
                <h3 className="font-caveat text-[24px] font-semibold italic text-[#9ca3af] mb-[18px]">Company</h3>
                <button onClick={() => onNavigate('about')} className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">About Us</button>
                <button className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">Terms of Service</button>
                <button className="font-dm-sans text-[14px] font-semibold text-[#111827] dark:text-white/80 mb-3.5 hover:text-[#1f65d6] text-left transition-colors">Privacy Policy</button>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-12 gap-6">
              <div className="font-dm-sans text-[12.5px] font-medium text-[#9ca3af] order-2 sm:order-1">
                © {new Date().getFullYear()} Starset. All rights reserved.
              </div>
              
              <div className="flex flex-col gap-3.5 order-1 sm:order-2 w-full sm:w-auto">
                <h4 className="text-[15px] font-normal text-[#6b7280] leading-[1.45]">
                  AI moves fast.<br/>
                  <strong className="block text-[19px] font-bold text-[#111827] dark:text-white mt-1">Stay ahead with Starset.</strong>
                </h4>
                
                <div className="flex w-full sm:w-[310px] bg-white border border-[#e5e7eb] dark:border-white/10 dark:bg-[#0e1014] rounded-xl p-[5px] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="flex-1 px-3.5 py-2.5 bg-transparent border-none outline-none font-dm-sans text-[13.5px] text-[#111827] dark:text-white placeholder-[#9ca3af]" 
                  />
                  <button className="px-[22px] py-2.5 bg-[#111214] dark:bg-white dark:text-black text-white font-dm-sans text-[13.5px] font-semibold rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.28),0_2px_8px_rgba(0,0,0,0.15)] hover:bg-black dark:hover:bg-zinc-200 hover:-translate-y-[1px] transition-all duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Massive Watermark */}
        <div className="max-w-[1150px] mx-auto -mt-[60px] pointer-events-none select-none relative z-0 leading-none" aria-hidden="true">
          <svg ref={svgRef} id="watermarkSvg" viewBox="62 95 876 175" preserveAspectRatio="xMidYMid meet" className="block w-full h-auto overflow-visible">
            <text ref={textRef} id="watermarkText" x="500" y="240" textAnchor="middle" fontSize="320" className="font-dm-sans font-bold tracking-[-0.03em] fill-black/5 dark:fill-white/5">Starset</text>
          </svg>
        </div>
      </section>
    </>
  );
};
