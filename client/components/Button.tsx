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
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg focus-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

  const variants = {
    primary: "bg-blue-600 !text-white hover:bg-blue-500 shadow-[0_4px_0_#1d4ed8,0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[0_0px_0_#1d4ed8] active:translate-y-1 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#1d4ed8,0_8px_16px_-4px_rgba(37,99,235,0.4)] border border-blue-600",

    glow: "bg-slate-900 !text-white hover:bg-slate-800 shadow-lg border border-slate-800 font-bold dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:border-white",

    black: "bg-slate-900 !text-white hover:bg-slate-800 shadow-[0_4px_0_#020617,0_2px_4px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_#020617] active:translate-y-1 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#020617,0_8px_16px_-4px_rgba(15,23,42,0.4)] border border-slate-900 dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:shadow-[0_4px_0_#94a3b8] dark:active:shadow-[0_0_0_#94a3b8] dark:hover:shadow-[0_6px_0_#94a3b8,0_8px_16px_-4px_rgba(255,255,255,0.2)] dark:border-white",

    secondary: "bg-white !text-slate-700 dark:!text-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 shadow-[0_4px_0_#e2e8f0,0_2px_4px_rgba(0,0,0,0.05)] active:shadow-[0_0px_0_#e2e8f0] active:translate-y-1 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0,0_8px_16px_-4px_rgba(0,0,0,0.1)] dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-[0_4px_0_#27272a] dark:active:shadow-[0_0px_0_#27272a] dark:hover:shadow-[0_6px_0_#27272a,0_8px_16px_-4px_rgba(0,0,0,0.2)] dark:hover:bg-zinc-800",

    danger: "bg-red-600 !text-white hover:bg-red-500 shadow-[0_4px_0_#991b1b,0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[0_0px_0_#991b1b] active:translate-y-1 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#991b1b,0_8px_16px_-4px_rgba(220,38,38,0.4)] border border-red-600",

    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5",

    outline: "bg-transparent border border-slate-200 !text-slate-700 dark:!text-white hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white dark:hover:bg-transparent"
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
    </button>
  );
};
