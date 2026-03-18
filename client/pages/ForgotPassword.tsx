import React, { useState } from "react";
import { Button } from "../components/Button";
import {
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Mail,
    Shield,
    User,
    Key,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { supabase } from "../supabaseClient";

interface ForgotPasswordProps {
    onBackToLogin: () => void;
    onBackHome: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
    onBackToLogin,
    onBackHome,
}) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mode, setMode] = useState<"contributor" | "admin">("contributor");

    const isContributor = mode === "contributor";

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Validate email
            if (!email.trim()) {
                setError("Please enter your email address");
                setIsLoading(false);
                return;
            }

            // If admin mode, verify the user is actually an admin before sending reset
            if (mode === "admin") {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role_text")
                    .eq("email", email.trim().toLowerCase())
                    .single();

                if (profileError || !profile) {
                    // Don't reveal whether the email exists for security
                    // Still show success to prevent email enumeration
                    setSuccess(true);
                    setIsLoading(false);
                    return;
                }

                if (profile.role_text !== "admin") {
                    setError("This email is not registered as an administrator");
                    setIsLoading(false);
                    return;
                }
            }

            // Send password reset email via Supabase
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo: `${window.location.origin}/#reset-password`,
                }
            );

            if (resetError) {
                console.error("Reset password error:", resetError);
                setError(resetError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode((prev) => (prev === "contributor" ? "admin" : "contributor"));
        setError(null);
        setSuccess(false);
        setEmail("");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black text-white">
            {/* HEADER */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={onBackHome}
                    >
                        <Logo className="h-14 w-14" />
                        <span className="font-bold text-sm tracking-widest uppercase">
                            Starset
                        </span>
                    </div>
                </div>
            </nav>

            <div className="w-full max-w-md z-10 pt-20">
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                            {isContributor ? (
                                <Mail className="h-8 w-8 text-teal-500" />
                            ) : (
                                <Shield className="h-8 w-8 text-purple-500" />
                            )}
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">
                        {isContributor ? "Reset Password" : "Admin Password Reset"}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {isContributor
                            ? "Enter your email to receive a reset link."
                            : "Enter your admin email to receive a reset link."}
                    </p>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">
                    {/* Success State */}
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-emerald-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-white">
                                Check Your Email
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                If an account exists for{" "}
                                <span className="font-semibold text-zinc-300">
                                    {email}
                                </span>
                                , we've sent a password reset link. Check your inbox and spam
                                folder.
                            </p>
                            <div className="pt-4 space-y-3">
                                <Button
                                    onClick={onBackToLogin}
                                    className="w-full h-11"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSuccess(false);
                                        setEmail("");
                                    }}
                                    className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
                                >
                                    Didn't receive it? Try again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Reset Form */}
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2 text-zinc-400">
                                        {isContributor ? "Work Email" : "Admin Email"}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            {isContributor ? (
                                                <User className="h-5 w-5 text-zinc-400" />
                                            ) : (
                                                <Shield className="h-5 w-5 text-purple-400" />
                                            )}
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white placeholder-zinc-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all"
                                            placeholder={
                                                isContributor
                                                    ? "name@starset.ai"
                                                    : "admin@starset.ai"
                                            }
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full h-11"
                                >
                                    Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>

                            {/* Back to Login */}
                            <div className="pt-4 border-t border-white/5 mt-4 text-center space-y-3">
                                <button
                                    type="button"
                                    onClick={onBackToLogin}
                                    className="text-xs text-blue-400 font-bold hover:underline flex items-center justify-center gap-1 w-full"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Back to Login
                                </button>

                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 flex items-center justify-center gap-2 w-full hover:text-zinc-300 transition-colors"
                                >
                                    {isContributor ? (
                                        <>
                                            <Key className="h-3 w-3" /> Admin Password Reset
                                        </>
                                    ) : (
                                        <>
                                            <User className="h-3 w-3" /> Contributor Password Reset
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="fixed bottom-6 text-[10px] text-zinc-500 flex items-center gap-2">
                <Logo className="h-12 w-12" />
                Starset Network • Secure Environment • v2.5.4
            </div>
        </div>
    );
};
