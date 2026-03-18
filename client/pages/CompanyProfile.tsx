import React from 'react';
import { Building2, Globe, Database, ShieldCheck, Heart } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

export const CompanyProfile: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  return (
    <PublicLayout currentPage="profile" onNavigate={onNavigate} onEnterApp={onEnterApp}>
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <span className="text-purple-400 font-bold uppercase tracking-widest text-xs block">Who We Are</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Built for Trust. <br />Built for You.</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Starset isn't just a tech company. We are a global community of people working together to build the future.
              </p>
              <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                Since 2023, we've paid out millions to contributors in over 14 countries. We prioritize your privacy, your security, and your payments.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
                  <Globe className="h-8 w-8 text-blue-400 mb-4" />
                  <div className="text-3xl font-black text-white mb-1">14+</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest font-black">Countries</div>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
                  <Heart className="h-8 w-8 text-purple-400 mb-4" />
                  <div className="text-3xl font-black text-white mb-1">50k+</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest font-black">Contributors</div>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
                  <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
                  <div className="text-3xl font-black text-white mb-1">100%</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest font-black">Secure Data</div>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:border-white/20 transition-all">
                  <Building2 className="h-8 w-8 text-orange-400 mb-4" />
                  <div className="text-3xl font-black text-white mb-1">24/7</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest font-black">Support</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-10 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                <div className="h-32 w-32 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Building2 className="h-16 w-16 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Headquarters</h3>
                <p className="text-zinc-500 text-lg mb-8 font-medium">San Francisco, California</p>
                <div className="w-full h-px bg-white/5 mb-8"></div>
                <div className="grid grid-cols-1 gap-4 w-full text-sm">
                  <p className="text-zinc-400 font-medium leading-relaxed italic">
                    "We believe anyone, anywhere should be able to earn money by contributing to the AI revolution."
                  </p>
                </div>
              </div>

              <div className="bg-blue-600/20 backdrop-blur-md p-10 rounded-3xl border border-blue-500/20 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
                <h3 className="font-black text-2xl mb-4 relative z-10">Need to check us out?</h3>
                <p className="text-zinc-300 mb-10 text-lg relative z-10 font-medium leading-relaxed">Read our reviews or check our community forums to see what other contributors say about their experience.</p>
                <a href="#" className="inline-block bg-white text-black px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-all relative z-10 shadow-lg">Visit Community</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
