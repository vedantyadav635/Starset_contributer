import React, { useEffect } from 'react';
import { Brain, Database, Mic, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { motion } from 'framer-motion';

interface PageProps {
   onNavigate: (page: PublicPageType) => void;
   onEnterApp: () => void;
}

export const AITrainingGuide: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <PublicLayout currentPage="blog" onNavigate={onNavigate} onEnterApp={onEnterApp}>
         <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#020205] pb-24">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto px-6 pt-24 md:pt-32 relative z-10">
               {/* Header */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16 md:mb-24 text-center"
               >
                  <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
                     Educational Guide
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                     How AI Models Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Human Intelligence</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                     Demystifying the process behind ChatGPT, voice assistants, and next-generation AI. Discover why human contributors are the most valuable asset in machine learning.
                  </p>
               </motion.div>

               {/* Content Blocks */}
               <div className="space-y-12 md:space-y-16">
                  
                  {/* Step 1 */}
                  <motion.section 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     className="bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/20 dark:shadow-none"
                  >
                     <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
                           <Database className="h-8 w-8" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Raw Data Collection</h2>
                           <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 text-lg">
                              Before an AI can "think," it needs to "read" and "listen." The foundational step of training an AI model involves collecting massive datasets of text, audio, and images. 
                           </p>
                           <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                              However, raw internet data is often messy, biased, or incorrect. This is where <strong className="text-slate-900 dark:text-white">High-Quality Human Data Collection</strong> comes in. Contributors provide clean, native audio recordings and culturally accurate text that form the pristine foundation of modern AI.
                           </p>
                        </div>
                     </div>
                  </motion.section>

                  {/* Step 2 */}
                  <motion.section 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     className="bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/20 dark:shadow-none"
                  >
                     <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                           <Brain className="h-8 w-8" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Supervised Fine-Tuning (SFT)</h2>
                           <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 text-lg">
                              Once the AI has a basic understanding of language, it needs to learn how to be useful. Supervised Fine-Tuning involves humans showing the AI exactly how to respond.
                           </p>
                           <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                              Contributors write highly accurate question-and-answer pairs, summarize documents, or write code. The AI studies these human-crafted examples to learn structure, tone, and factual accuracy.
                           </p>
                        </div>
                     </div>
                  </motion.section>

                  {/* Step 3 */}
                  <motion.section 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     className="bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/20 dark:shadow-none"
                  >
                     <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                           <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Reinforcement Learning from Human Feedback (RLHF)</h2>
                           <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 text-lg">
                              This is the secret sauce behind modern conversational AI. The AI generates multiple possible answers to a question, and human contributors rank them from best to worst.
                           </p>
                           <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">
                              By scoring the AI's output, humans teach the model to align with human values—avoiding harmful responses, remaining unbiased, and being genuinely helpful. <strong className="text-slate-900 dark:text-white">AI alignment cannot exist without continuous human feedback.</strong>
                           </p>
                        </div>
                     </div>
                  </motion.section>
               </div>

               {/* Call to Action */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-center relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10 tracking-tight">
                     Be the Intelligence Behind the AI
                  </h2>
                  <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                     Your voice, language skills, and expertise are exactly what the next generation of AI needs. Join Starset today and get paid to shape the future.
                  </p>
                  <button 
                     onClick={() => onNavigate('signup')}
                     className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 mx-auto"
                  >
                     Start Contributing <ArrowRight className="h-5 w-5" />
                  </button>
               </motion.div>
            </div>
         </div>
      </PublicLayout>
   );
};
