import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface StickerProps {
  imageUrl: string;
  altText: string;
  prefix: string;
  index: number;
}

const BRAND_GRADIENTS = [
  'linear-gradient(135deg, #FF6B6B 0%, #96031F 100%)', // red to purple
  'linear-gradient(135deg, #FDBB2D 0%, #D4A373 100%)', // yellow to ochre
  'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)', // green to mint
  'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)', // pink to yellow
  'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)', // blue to cyan
  'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', // indigo to purple
  'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)', // pink to red
  'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)', // mint to blue
];

export const Sticker: React.FC<StickerProps> = ({ imageUrl, altText, prefix, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  // 3D physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const glareOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.8]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "150%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "150%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Organic rotation and color
  const baseRotations = [-4, 5, -6, 3, -2, 4, -5, 2, -3, 6];
  const initialRotate = baseRotations[index % baseRotations.length];

  // Hash for prefix to color
  let hash = 0;
  for (let i = 0; i < prefix.length; i++) {
    hash = prefix.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % BRAND_GRADIENTS.length;
  const stickerGradient = BRAND_GRADIENTS[colorIndex];

  return (
    <div className="perspective-1000 w-full h-full relative" style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ rotate: initialRotate, scale: 0.9, opacity: 0 }}
        animate={{ rotate: initialRotate, scale: 1, opacity: 1 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full cursor-pointer z-20 group "
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-shadow duration-300"
          style={{
            background: stickerGradient,
            border: "4px solid white",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2), 0 0 15px rgba(0,0,0,0.1)",
          }}
          whileHover={{
            boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 25px rgba(0,0,0,0.2)",
            scale: 1.05
          }}
        >
          {/* Background Image / Sticker Graphics */}
          <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt={altText}
              className="absolute bottom-0 right-0 w-full h-full invert brightness-50 object-cover opacity-90 drop-shadow-2xl pointer-events-none transform"
            />
          </div>

          {/* Glare effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              opacity: glareOpacity,
              background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.8) 25%, transparent 30%)",
              x: glareX,
              y: glareY,
              scale: 2, // scale up so it covers fully during translation
            }}
          />

          <div className="absolute inset-0 z-30 shadow-inner rounded-full pointer-events-none" style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.15)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
};
