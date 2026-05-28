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
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg btn-press focus-ring disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

  const variants = {
    primary: "bg-blue-600 !text-white hover:bg-blue-700 shadow-md hover:shadow-lg border border-blue-700/20",

    glow: "bg-slate-900 !text-white hover:bg-slate-800 shadow-lg border border-slate-800 font-bold dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:border-white",

    black: "bg-slate-900 !text-white hover:bg-slate-800 border border-slate-800 shadow-md hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:border-zinc-800",

    secondary: "bg-white backdrop-blur-md !text-slate-700 dark:!text-white border border-slate-200 hover:bg-slate-50 hover:text-blue-700 shadow-sm hover:shadow-md dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20 dark:hover:text-white",

    danger: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20 dark:text-red-400",

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
