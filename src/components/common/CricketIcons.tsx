import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Blue Batting Helmet with Faceguard
export const CricketHelmetIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M20 50C20 32 34 18 52 18C70 18 84 32 84 50V56C84 62 80 66 74 66H30C24 66 20 62 20 56V50Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
    <path d="M16 48C16 30 30 16 52 16C74 16 88 30 88 48C88 54 84 58 78 58H26C20 58 16 54 16 48Z" fill="#60A5FA" />
    <path d="M30 26C36 20 44 18 52 18C60 18 68 20 74 26" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
    {/* Visor Peak */}
    <path d="M50 48L88 44C92 44 94 48 90 52L76 60" fill="#2563EB" stroke="#1E40AF" strokeWidth="3" />
    {/* Metal Grill */}
    <path d="M32 64L38 88C40 92 64 92 68 88L74 64" fill="none" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36 74H70" stroke="#64748B" strokeWidth="3" />
    <path d="M40 82H66" stroke="#64748B" strokeWidth="3" />
    <circle cx="28" cy="56" r="3" fill="#1E40AF" />
    <circle cx="76" cy="56" r="3" fill="#1E40AF" />
  </svg>
);

// Wooden Cricket Bat with Grip
export const CricketBatIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Handle */}
    <rect x="74" y="12" width="8" height="26" rx="4" transform="rotate(45 74 12)" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
    <path d="M68 24L74 18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M72 28L78 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Blade */}
    <path d="M60 26L22 64C18 68 18 76 22 80L24 82C28 86 36 86 40 82L78 44C80 42 80 38 78 36L68 26C66 24 62 24 60 26Z" fill="#FDBA74" stroke="#EA580C" strokeWidth="3.5" />
    <path d="M56 34L30 60C28 62 28 66 30 68L32 70" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" />
    <path d="M46 44L64 26" stroke="#FB923C" strokeWidth="3" strokeLinecap="round" />
    <rect x="22" y="74" width="16" height="4" rx="2" transform="rotate(-45 22 74)" fill="#C2410C" />
  </svg>
);

// Blue Batting Leg Pads
export const CricketPadsIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Left Pad */}
    <rect x="20" y="16" width="28" height="68" rx="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
    <line x1="28" y1="22" x2="28" y2="78" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="34" y1="20" x2="34" y2="80" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="22" x2="40" y2="78" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="18" y="38" width="32" height="8" rx="3" fill="#2563EB" />
    <circle cx="34" cy="74" r="3" fill="#1E40AF" />
    {/* Right Pad */}
    <rect x="52" y="16" width="28" height="68" rx="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
    <line x1="60" y1="22" x2="60" y2="78" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="66" y1="20" x2="66" y2="80" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="72" y1="22" x2="72" y2="78" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="50" y="38" width="32" height="8" rx="3" fill="#2563EB" />
    <circle cx="66" cy="74" r="3" fill="#1E40AF" />
  </svg>
);

// Wooden Stumps with Bails
export const CricketWicketsIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Stumps */}
    <rect x="24" y="24" width="8" height="64" rx="3" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
    <rect x="46" y="24" width="8" height="64" rx="3" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
    <rect x="68" y="24" width="8" height="64" rx="3" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
    {/* Bails */}
    <rect x="20" y="18" width="28" height="6" rx="3" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
    <rect x="52" y="18" width="28" height="6" rx="3" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
    {/* Ground line */}
    <line x1="14" y1="88" x2="86" y2="88" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Red / Coral Batting Gloves
export const CricketGlovesIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Glove body */}
    <path d="M30 40C30 26 42 16 56 16C70 16 80 26 80 40V74C80 82 72 88 64 88H46C38 88 30 82 30 74V40Z" fill="#F87171" stroke="#DC2626" strokeWidth="3" />
    {/* Finger sausages */}
    <rect x="36" y="22" width="7" height="24" rx="3.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    <rect x="46" y="18" width="7" height="28" rx="3.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    <rect x="56" y="20" width="7" height="26" rx="3.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    <rect x="66" y="26" width="7" height="20" rx="3.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    {/* Thumb */}
    <path d="M28 50C22 50 18 56 22 64L30 72V54C30 50 28 50 28 50Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    {/* Wristband */}
    <rect x="34" y="76" width="42" height="10" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

// Red Stitched Cricket Ball
export const CricketBallIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="50" cy="50" r="38" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" />
    <circle cx="42" cy="38" r="8" fill="#F87171" opacity="0.6" />
    {/* Seam Stitching */}
    <path d="M24 24C38 38 62 62 76 76" stroke="#FFFFFF" strokeWidth="3.5" strokeDasharray="4 3" strokeLinecap="round" />
    <path d="M28 20C42 34 66 58 80 72" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.8" />
  </svg>
);

// Wooden Bat Mallet
export const CricketMalletIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Handle */}
    <rect x="46" y="36" width="8" height="52" rx="4" fill="#FDBA74" stroke="#EA580C" strokeWidth="2.5" />
    {/* Head */}
    <rect x="22" y="16" width="56" height="24" rx="8" fill="#FB923C" stroke="#C2410C" strokeWidth="3" />
    <line x1="32" y1="20" x2="32" y2="36" stroke="#FDBA74" strokeWidth="2.5" />
    <line x1="68" y1="20" x2="68" y2="36" stroke="#FDBA74" strokeWidth="2.5" />
  </svg>
);
