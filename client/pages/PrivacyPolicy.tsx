import React from 'react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Shield, Eye, Lock, FileText, UserCheck, Scale, Activity } from 'lucide-react';

interface PageProps {
    onNavigate: (page: PublicPageType) => void;
    onEnterApp: () => void;
}

export const PrivacyPolicy: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
    return (
        <PublicLayout
            currentPage="privacy"
            onNavigate={onNavigate}
            onEnterApp={onEnterApp}
        >
            <div className="relative py-24 sm:py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
                            <Shield className="h-4 w-4" />
                            Data Protection
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-zinc-400 text-xl">
                            How we collect, use, and protect your personal information at Starset.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Introduction */}
                        <section className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-500" />
                                Our Commitment
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                At Starset, we take your privacy seriously. This policy explains what information we collect when you use our platform, how we use it, and your rights regarding your data. We aim for total transparency in how we handle the information you entrust to us.
                            </p>
                        </section>

                        {/* Data Collection */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <UserCheck className="h-5 w-5 text-emerald-500" />
                                    Account Info
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    We collect your name, email, and payment details to manage your account, process your earnings, and verify your identity as a contributor.
                                </p>
                            </div>

                            <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-blue-500" />
                                    Task Activity
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    We record your task submissions and performance metrics to ensure quality control and calculate fair compensation for your work.
                                </p>
                            </div>
                        </div>

                        {/* How we use data */}
                        <section className="bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-10 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />

                            <h2 className="text-2xl font-bold text-white mb-8">How We Use Your Data</h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Service Delivery", desc: "Providing you with access to AI training tasks and managing your contributor profile." },
                                    { title: "Earnings Processing", desc: "Calculating and sending payments to your registered banking or wallet details." },
                                    { title: "Security & Fraud", desc: "Protecting against unauthorized access and ensuring the integrity of task data." },
                                    { title: "AI Improvement", desc: "De-identified task data is used to train and improve AI models for our clients." }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 group/item">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold group-hover/item:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-zinc-400">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* User Rights */}
                        <section className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Scale className="h-6 w-6 text-purple-500" />
                                Your Rights
                            </h2>
                            <div className="grid gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        <span className="font-bold text-white italic">Access & Portability:</span> You can request a copy of the personal data we hold about you at any time.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        <span className="font-bold text-white italic">Correction & Deletion:</span> You have the right to correct inaccurate data or request the deletion of your account and associated personal info.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        <span className="font-bold text-white italic">Data Minimization:</span> We only collect what is strictly necessary to provide our services and protect our platform.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="text-center bg-zinc-900/40 rounded-3xl p-10 border border-white/5">
                            <Lock className="h-10 w-10 text-zinc-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">Questions about Data?</h2>
                            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                If you have any questions about this Privacy Policy or how we handle your data, please contact our Data Protection Officer at privacy@starset.intelligence.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Last Updated: March 2024</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};
