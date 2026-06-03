import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import {
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { supabase } from "../supabaseClient";

interface ResetPasswordProps {
    onBackToLogin: () => void;
    onBackHome: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
    onBackToLogin,
    onBackHome,
}) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Password strength indicators
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const passwordStrength = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

    const getStrengthLabel = () => {
        if (passwordStrength <= 1) return { label: "Weak", color: "text-red-500", bg: "bg-red-500" };
        if (passwordStrength <= 2) return { label: "Fair", color: "text-orange-500", bg: "bg-orange-500" };
        if (passwordStrength <= 3) return { label: "Good", color: "text-yellow-500", bg: "bg-yellow-500" };
        if (passwordStrength <= 4) return { label: "Strong", color: "text-emerald-500", bg: "bg-emerald-500" };
        return { label: "Very Strong", color: "text-emerald-500", bg: "bg-emerald-500" };
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Validate passwords
            if (password.length < 8) {
                setError("Password must be at least 8 characters long");
                setIsLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            if (passwordStrength < 3) {
                setError("Please choose a stronger password");
                setIsLoading(false);
                return;
            }

            // Update password via Supabase
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                console.error("Password update error:", updateError);
                setError(updateError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);

            // Sign out after password reset so they log in with new password
            setTimeout(async () => {
                await supabase.auth.signOut();
            }, 1000);
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const strength = getStrengthLabel();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
            {/* HEADER */}
            <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
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
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 backdrop-blur-md">
                            <ShieldCheck className="h-8 w-8 text-teal-500" />
                        </div>
                    </div>

                    <h1 className="text-xl font-bold">Set New Password</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Choose a strong password for your account.
                    </p>
                </div>

                <div className="bg-slate-100/40 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
                    {/* Success State */}
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-emerald-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Password Updated!
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Your password has been successfully reset. You can now log in
                                with your new password.
                            </p>
                            <div className="pt-4">
                                <Button
                                    onClick={onBackToLogin}
                                    className="w-full h-11"
                                >
                                    Continue to Login <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
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
                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2 text-zinc-400">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all"
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-300 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Meter */}
                                    {password.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                                                    Strength
                                                </span>
                                                <span className={`text-[10px] uppercase tracking-wider font-bold ${strength.color}`}>
                                                    {strength.label}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength
                                                            ? strength.bg
                                                            : "bg-zinc-700"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 mt-2">
                                                {[
                                                    { check: hasMinLength, label: "8+ characters" },
                                                    { check: hasUppercase, label: "Uppercase" },
                                                    { check: hasLowercase, label: "Lowercase" },
                                                    { check: hasNumber, label: "Number" },
                                                    { check: hasSpecial, label: "Special char" },
                                                ].map((req, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`text-[10px] flex items-center gap-1 ${req.check
                                                            ? "text-emerald-500"
                                                            : "text-zinc-400"
                                                            }`}
                                                    >
                                                        {req.check ? (
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        ) : (
                                                            <div className="h-3 w-3 rounded-full border border-zinc-400" />
                                                        )}
                                                        {req.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2 text-zinc-400">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            className={`w-full pl-12 pr-12 py-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all ${confirmPassword.length > 0
                                                ? password === confirmPassword
                                                    ? "border-emerald-500 focus:border-emerald-500"
                                                    : "border-red-500 focus:border-red-500"
                                                : "focus:border-teal-600"
                                                }`}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-300 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword.length > 0 && password !== confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full h-11"
                                >
                                    Update Password <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
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
