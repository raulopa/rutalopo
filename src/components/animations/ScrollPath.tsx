import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface ScrollPathProps {
  className?: string;
}

export function ScrollPath({ className = "" }: ScrollPathProps) {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <svg 
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-30 ${className}`} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 10 0 Q 30 25 50 50 T 90 100"
        fill="transparent"
        strokeWidth="0.5"
        stroke="var(--color-brand-purple)"
        style={{ pathLength }}
      />
    </svg>
  );
}
