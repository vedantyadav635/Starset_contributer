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
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-2xl focus-ring transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";

  const variants = {
    primary: "bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white dark:text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] border border-blue-400/30 hover:-translate-y-1 active:translate-y-0 active:shadow-none",
    
    glow: "bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white dark:text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] border border-blue-400/30 hover:-translate-y-1 active:translate-y-0 active:shadow-none",

    black: "bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white dark:text-white shadow-lg shadow-black/30 hover:shadow-xl border border-slate-600/50 hover:-translate-y-1 active:translate-y-0 active:shadow-none",

    secondary: "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 hover:-translate-y-1 active:translate-y-0 transition-all border border-slate-200 dark:border-white/10",

    danger: "bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white dark:text-white shadow-lg shadow-red-600/30 hover:shadow-xl border border-red-400/30 hover:-translate-y-1 active:translate-y-0 active:shadow-none",

    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 transition-all",

    outline: "bg-transparent text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:-translate-y-1 active:translate-y-0 transition-all"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const isGradient = ['primary', 'glow', 'black', 'danger'].includes(variant);

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center text-white dark:text-white">
        {isLoading ? (
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : null}
        <span className={isGradient ? "text-white" : ""}>{children}</span>
      </span>
      
      {isGradient && (
        <>
          {/* 3D Inner Highlight */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
          {/* Sweep animation on hover */}
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
        </>
      )}
    </button>
  );
};
