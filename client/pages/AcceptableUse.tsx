import React from 'react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { ShieldAlert, Zap, CheckCircle, Ban, MessageSquareWarning, Fingerprint } from 'lucide-react';

interface PageProps {
    onNavigate: (page: PublicPageType) => void;
    onEnterApp: () => void;
}

export const AcceptableUse: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
    return (
        <PublicLayout
            currentPage="acceptable-use"
            onNavigate={onNavigate}
            onEnterApp={onEnterApp}
        >
            <div className="relative py-24 sm:py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold uppercase tracking-widest mb-6 border border-emerald-500/20">
                            <ShieldAlert className="h-4 w-4" />
                            Safety Standards
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
                            Acceptable Use Policy
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xl">
                            Our standards for ensuring a high-quality and safe environment for all contributors.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Core Principle */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                <Zap className="h-6 w-6 text-amber-500" />
                                Core Objective
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                The Starset terminal is designed to train the world's most advanced AI models. To achieve this, every contribution must be authentic, human-generated, and of the highest quality. This policy outlines the behaviors that are strictly prohibited on our platform.
                            </p>
                        </section>

                        {/* Prohibited Behaviors */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Ban className="h-5 w-5 text-red-500" />
                                    Automation & AI
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    The use of bots, scripts, or other AI systems to complete tasks is strictly forbidden. We collect biometric and behavioral data to ensure all work is done by real humans.
                                </p>
                            </div>

                            <div className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                    <MessageSquareWarning className="h-5 w-5 text-zinc-400" />
                                    Harmful Content
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Do not submit content that is illegal, hateful, or intentionally misleading. Any attempt to "jailbreak" or "poison" AI training datasets will result in an immediate permanent ban.
                                </p>
                            </div>
                        </div>

                        {/* Allowed Actions */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 p-10 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />

                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">What We Expect</h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Authenticity", desc: "Every task should reflect your genuine, honest input." },
                                    { title: "Attention to Detail", desc: "Follow task-specific instructions precisely to avoid rejection." },
                                    { title: "Professional Conduct", desc: "Treat support staff and community members with respect." },
                                    { title: "Single Account", desc: "Each contributor is allowed only one account. Multi-accounting is detection as fraud." }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 group/item">
                                        <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Enforcement */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                                <Fingerprint className="h-6 w-6 text-blue-500" />
                                Enforcement & Monitoring
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                                We utilize a combination of algorithmic quality scores, manual review, and behavioral analysis to identify violations. We reserve the right to:
                            </p>
                            <div className="grid gap-4 text-sm">
                                <div className="p-3 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-400 italic">
                                    • Reject individual task submissions without payment for poor quality.
                                </div>
                                <div className="p-3 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-400 italic">
                                    • Temporarily suspend terminal access during ongoing investigations.
                                </div>
                                <div className="p-3 bg-zinc-900/50 rounded-xl border border-white/5 text-zinc-400 italic">
                                    • Permanently ban users and forfeit all accrued earnings for severe violations.
                                </div>
                            </div>
                        </section>

                        {/* Reporting */}
                        <section className="text-center bg-zinc-900/40 rounded-3xl p-10 border border-white/5">
                            <ShieldAlert className="h-10 w-10 text-zinc-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Report a Violation</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                If you spot suspicious activity or believe a task contains inappropriate content, please report it immediately to compliance@starset.intelligence.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Policy Version: 2.1 • March 2024</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};
