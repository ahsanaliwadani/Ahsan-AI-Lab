import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  taglineClassName?: string;
  className?: string;
  isLink?: boolean;
  logoSrc?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  taglineClassName = '',
  className = '',
  logoSrc = '/logo.jpg',
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    xs: { img: 'h-6 sm:h-7 w-auto max-h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { img: 'h-7 sm:h-8 w-auto max-h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { img: 'h-9 sm:h-10 w-auto max-h-10', text: 'text-lg sm:text-xl', sub: 'text-[10px]' },
    lg: { img: 'h-11 sm:h-12 w-auto max-h-12', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { img: 'h-14 sm:h-16 w-auto max-h-16', text: 'text-2xl sm:text-3xl', sub: 'text-xs' }
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-2.5 sm:space-x-3 group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Clean Direct Logo - Without any box, border or background */}
      <div className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {!imageError ? (
          <img
            src={logoSrc}
            alt="AHSAN AI LABS Logo"
            onError={() => setImageError(true)}
            className={`${config.img} object-contain block`}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Cyber Vector Monogram Fallback (No Box / No BG) */
          <svg 
            viewBox="0 0 512 512" 
            className={`${config.img} drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]`} 
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
        )}
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
