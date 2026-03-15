import React from 'react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Gavel, ShieldCheck, Scale, AlertCircle, FileText, Landmark } from 'lucide-react';

interface PageProps {
    onNavigate: (page: PublicPageType) => void;
    onEnterApp: () => void;
}

export const TermsOfService: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
    return (
        <PublicLayout
            currentPage="terms"
            onNavigate={onNavigate}
            onEnterApp={onEnterApp}
        >
            <div className="relative py-24 sm:py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-bold uppercase tracking-widest mb-6 border border-indigo-500/20">
                            <Gavel className="h-4 w-4" />
                            Platform Agreement
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xl">
                            The rules and guidelines for using the Starset contributor platform.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Acceptance */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-indigo-500" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                By accessing or using the Starset platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use the services or execute any tasks on our terminal.
                            </p>
                        </section>

                        {/* Contributor Responsibilities */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-emerald-500" />
                                    Data Integrity
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Contributors must provide accurate, high-quality data. Fraudulent submissions or use of automated bots will result in immediate account termination and forfeiture of earnings.
                                </p>
                            </div>

                            <div className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                    Account Security
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    You are responsible for maintaining the confidentiality of your terminal access credentials. Starset is not liable for any losses occurring from unauthorized account usage.
                                </p>
                            </div>
                        </div>

                        {/* Compensation and Payouts */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 p-10 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500" />

                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">2. Compensation & Payouts</h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Task Validation", desc: "Earnings are only credited after submissions pass our automated and manual quality checks." },
                                    { title: "Minimum Threshold", desc: "Payouts can be requested once your wallet reaches the minimum specified balance." },
                                    { title: "Payment Processing", desc: "We process payments within 5-7 business days to your verified payout method." },
                                    { title: "Tax Compliance", desc: "Contributors are responsible for reporting and paying any taxes applicable to their earnings." }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 group/item">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold group-hover/item:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Termination */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
                                <Scale className="h-6 w-6 text-red-500" />
                                3. Termination & Suspension
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                Starset reserves the right to suspend or terminate access to the terminal at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                            </p>
                            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/20 text-xs text-red-500/80 font-medium">
                                IMPORTANT: Accounts inactive for more than 180 days may be subject to closure and balance expiration.
                            </div>
                        </section>

                        {/* Governing Law */}
                        <section className="text-center bg-zinc-900/40 rounded-3xl p-10 border border-white/5">
                            <Landmark className="h-10 w-10 text-zinc-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Governing Law</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Starset Intelligence is registered, without regard to its conflict of law provisions.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Effective Date: March 2024</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};
