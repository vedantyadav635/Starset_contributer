import React from 'react';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';

interface PageProps {
   onNavigate: (page: PublicPageType) => void;
   onEnterApp: () => void;
}

export const Contact: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
   return (
      <PublicLayout currentPage="contact" onNavigate={onNavigate} onEnterApp={onEnterApp}>
         <section className="py-24 px-6 relative overflow-hidden min-h-[80vh]">
            <div className="max-w-7xl mx-auto">
               <div className="mb-16 text-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 block">Get in Touch</span>
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
                     <span className="text-slate-900 dark:text-white">We're here to </span>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">help you.</span>
                  </h1>
               </div>

               <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mt-16">
                  {/* Contact Info */}
                  <div className="flex flex-col gap-8">
                     <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 flex items-start gap-6">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                           <Mail className="h-6 w-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Support</h3>
                           <p className="text-slate-600 dark:text-zinc-400 mb-4">Our team typically responds within 24 hours.</p>
                           <a href="mailto:support@starset.ai" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">support@starset.ai</a>
                        </div>
                     </div>

                     <div className="bg-slate-50 dark:bg-zinc-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 flex items-start gap-6">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                           <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Headquarters</h3>
                           <p className="text-slate-600 dark:text-zinc-400">
                              San Francisco, CA<br />
                              United States
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-white dark:bg-[#09090b] p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a message</h3>
                     <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! Our team will contact you shortly."); }}>
                        <div className="flex flex-col gap-2">
                           <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Name</label>
                           <input type="text" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="John Doe" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Email Address</label>
                           <input type="email" required className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="john@example.com" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Message</label>
                           <textarea required rows={4} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" placeholder="How can we help?"></textarea>
                        </div>
                        <Button type="submit" className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 !text-white flex items-center justify-center gap-2">
                           Send Message <Send className="w-4 h-4" />
                        </Button>
                     </form>
                  </div>
               </div>
            </div>
         </section>
      </PublicLayout>
   );
};
