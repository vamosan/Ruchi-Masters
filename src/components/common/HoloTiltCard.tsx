import React, { useState, useRef, MouseEvent } from 'react';

interface HoloTiltCardProps {
  children: React.ReactNode;
  className?: string;
  isSpecial?: boolean;
  maxRotation?: number;
  onClick?: () => void;
}

export const HoloTiltCard: React.FC<HoloTiltCardProps> = ({
  children,
  className = '',
  isSpecial = false,
  maxRotation = 12,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxRotation;
    const rotY = ((x - centerX) / centerX) * maxRotation;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotX, y: rotY });
    setGlare({ x: glareX, y: glareY, opacity: isSpecial ? 0.35 : 0.2 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className={'relative transition-transform duration-100 ease-out select-none ' + className}
    >
      <div
        style={{
          transform: isHovered
            ? 'rotateX(' + rotation.x + 'deg) rotateY(' + rotation.y + 'deg) translateZ(10px)'
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full"
      >
        {children}

        {/* Dynamic Holographic Foil Glare Overlay */}
        <div
          style={{
            background: isSpecial
              ? 'radial-gradient(circle at ' + glare.x + '% ' + glare.y + '%, rgba(255, 230, 0, 0.45) 0%, rgba(0, 240, 255, 0.35) 35%, rgba(255, 51, 102, 0.25) 65%, transparent 80%)'
              : 'radial-gradient(circle at ' + glare.x + '% ' + glare.y + '%, rgba(204, 255, 0, 0.35) 0%, rgba(0, 240, 255, 0.2) 40%, transparent 75%)',
            opacity: glare.opacity,
            mixBlendMode: 'color-dodge',
            pointerEvents: 'none',
          }}
          className="absolute inset-0 rounded-3xl transition-opacity duration-200 z-20 pointer-events-none"
        />

        {/* Shimmer Border Light for Captains & Star Players */}
        {isSpecial && isHovered && (
          <div
            style={{
              background: 'linear-gradient(' + (rotation.y * 10 + 45) + 'deg, #CCFF00, #00F0FF, #FF3366, #CCFF00)',
              backgroundSize: '200% 200%',
            }}
            className="absolute -inset-0.5 rounded-3xl opacity-60 blur-xs -z-10 animate-pulse pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};
