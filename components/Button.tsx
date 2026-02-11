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
    primary: "bg-gradient-to-b from-[#0f766e] to-[#0d6b63] text-white hover:from-[#118d83] hover:to-[#0f766e] shadow-[0_4px_0_#0a524c,0_10px_15px_-3px_rgba(0,0,0,0.3)] active:shadow-none hover:-translate-y-0.5 border-t border-white/20", 
    
    // Glow: High impact CTA
    glow: "bg-white text-black hover:bg-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white hover:border-zinc-200 font-bold hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]",
    
    black: "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
    
    secondary: "bg-white/10 backdrop-blur-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 hover:bg-white/20 shadow-sm hover:shadow-md",
    
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
    
    ghost: "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5",
    
    outline: "bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
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