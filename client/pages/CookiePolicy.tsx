import React from 'react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Shield, Cookie, Eye, Lock, RefreshCcw } from 'lucide-react';

interface PageProps {
    onNavigate: (page: PublicPageType) => void;
    onEnterApp: () => void;
}

export const CookiePolicy: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
    return (
        <PublicLayout
            currentPage="home" // We use home layout for legal pages
            onNavigate={onNavigate}
            onEnterApp={onEnterApp}
        >
            <div className="relative py-24 sm:py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
                            <Shield className="h-4 w-4" />
                            Legal Transparency
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
                            Cookie Policy
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xl">
                            How we use digital identifiers to provide a better, more secure experience.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Introduction */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                <Cookie className="h-6 w-6 text-amber-500" />
                                What are Cookies?
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Cookies are small text files stored in your browser that help us recognize your device. They allow the Starset platform to function smoothly, remember your preferences, and keep your data secure. We also use similar technologies like "Local Storage" for the same reasons.
                            </p>
                        </section>

                        {/* Types of Cookies */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-emerald-500" />
                                    Essential
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Required for core platform features like logging in to your contributor dashboard, protecting your payments, and preventing fraud. These cannot be disabled.
                                </p>
                            </div>

                            <div className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-lg">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-blue-500" />
                                    Analytics
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    These help us understand how people use our site—like which tasks are most popular—so we can improve the experience for everyone.
                                </p>
                            </div>
                        </div>

                        {/* How we use them */}
                        <section className="bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 p-10 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />

                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">How We Use Cookies</h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Authentication", desc: "Keeping you logged in as you navigate between tasks and your wallet." },
                                    { title: "Security", desc: "Detecting unusual activity and preventing automated bots from clicking tasks." },
                                    { title: "Preferences", desc: "Remembering your theme settings (Dark/Light Mode) so you don't have to reset them." },
                                    { title: "Performance", desc: "Helping the platform load faster by caching minor assets." }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 group/item">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold group-hover/item:scale-110 transition-transform">
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

                        {/* Management */}
                        <section className="text-center bg-zinc-900/40 rounded-3xl p-10 border border-white/5">
                            <RefreshCcw className="h-10 w-10 text-zinc-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Managing Your Cookies</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                Most browsers allow you to block or delete cookies in their settings. However, please note that if you disable essential cookies, the Starset terminal and task execution modules may not function correctly.
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
