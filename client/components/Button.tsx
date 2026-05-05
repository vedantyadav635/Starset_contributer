import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'black' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.96] active:translate-y-0.5 relative overflow-hidden group";

  const variants = {
    // Primary: Elegant Blue with 3D layers
    primary: "bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-slate-50 hover:from-[#60a5fa] hover:to-[#3b82f6] shadow-[0_4px_0_#1e40af,0_10px_15px_-3px_rgba(37,99,235,0.2)] active:shadow-none hover:-translate-y-0.5 border-t border-white/20",

    // Glow: High impact CTA
    glow: "bg-slate-950 text-slate-50 hover:bg-slate-800 shadow-[0_14px_35px_-18px_rgba(15,23,42,0.75)] border border-slate-950 font-bold hover:-translate-y-1 hover:shadow-[0_18px_45px_-20px_rgba(37,99,235,0.55)] dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:border-white dark:shadow-[0_0_20px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]",

    black: "bg-slate-950 text-slate-50 hover:bg-slate-800 border border-slate-950 shadow-lg hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:border-zinc-800",

    secondary: "bg-white backdrop-blur-md text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 shadow-sm hover:shadow-md dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20 dark:hover:text-white",

    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",

    ghost: "text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5",

    outline: "bg-transparent border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white dark:hover:bg-transparent dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wide",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-8 py-4 text-base tracking-wide"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : null}
      {children}
      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none"></div>
    </button>
  );
};
