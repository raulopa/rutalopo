import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export function ShinyButton({ children, onClick, className = "", href }: ShinyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  const classes = `relative overflow-hidden group px-8 py-4 font-bold rounded-xl transition-transform active:scale-95 ${className}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      
      {/* Background glow effect that follows mouse */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 80px at ${position.x}px ${position.y}px, rgba(255,255,255,0.3), transparent 100%)`,
          }}
        />
      )}
      
      {/* Permanent internal reflection line */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
    </>
  );

  if (href) {
    return (
      <a 
        ref={buttonRef as any}
        href={href}
        className={classes}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as any}
      onClick={onClick}
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </button>
  );
}
