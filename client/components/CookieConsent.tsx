import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show banner with a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
                >
                    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
                        {/* Subtle glow effect */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500" />

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Cookie className="h-5 w-5 text-blue-500" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
                                    Cookie Notice
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-medium">
                                    We use cookies to enhance your experience, analyze site traffic, and for security. By continuing to visit this site you agree to our use of cookies.
                                </p>

                                <div className="flex gap-3">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="flex-1 justify-center bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-500/20"
                                        onClick={handleAccept}
                                    >
                                        Accept Data
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 justify-center bg-white/5 border-white/10 hover:bg-white/10 text-white"
                                        onClick={handleDecline}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
