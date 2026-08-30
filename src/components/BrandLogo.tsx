import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  taglineClassName?: string;
  className?: string;
  isLink?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  taglineClassName = '',
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg sm:text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-2xl sm:text-3xl', sub: 'text-xs' }
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Brand Icon Badge */}
      <div className={`relative ${config.box} rounded-xl p-[1.5px] bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 group-hover:scale-105 transition-all duration-300`}>
        <div className="w-full h-full bg-[#081120] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
          {/* Cyber 'A' Vector Monogram */}
          <svg 
            viewBox="0 0 512 512" 
            className="w-full h-full drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="brandGradA" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {/* Main Cyber Frame */}
            <path d="M256 64 L370 230 L326 230 L256 128 L186 230 L142 230 Z" fill="url(#brandGradA)" />
            <path d="M186 230 L110 390 L174 390 L214 300 L270 300 L238 230 Z" fill="#1D4ED8" />
            <path d="M326 230 L294 300 L350 300 L390 390 L454 390 L370 230 Z" fill="url(#neonCyan)" />

            {/* Internal Circuit traces */}
            <path d="M142 350 L230 350 L256 295 L256 140" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M280 295 L324 350 L376 350" stroke="#00F0FF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />

            {/* Inner Triangle cut */}
            <polygon points="256,160 292,238 220,238" fill="#081120" stroke="#00F0FF" strokeWidth="10" />

            {/* Circuit Nodes */}
            <circle cx="142" cy="350" r="20" fill="#00F0FF" stroke="#FFFFFF" strokeWidth="6" />
            <circle cx="376" cy="350" r="20" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="6" />
            <circle cx="256" cy="140" r="18" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="6" />
            <circle cx="256" cy="202" r="10" fill="#00F0FF" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className={`font-heading font-extrabold tracking-tight text-white flex items-center gap-1.5 ${config.text} ${textClassName}`}>
            <span>AHSAN</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">AI LABS</span>
          </div>
          <div className={`font-medium tracking-widest text-slate-400 uppercase -mt-0.5 ${config.sub} ${taglineClassName}`}>
            Intelligence • Automation • Innovation
          </div>
        </div>
      )}
    </div>
  );
};
