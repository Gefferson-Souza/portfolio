import React from 'react';
import { motion } from 'framer-motion';

interface CircleIndicatorProps {
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  size: string;
  color: string;
}

export const CircleIndicator: React.FC<CircleIndicatorProps> = ({ position, size, color }) => {
  return (
    <motion.div
      className="absolute z-10"
      style={{
        ...position,
        width: size,
        height: size,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.2, 1],
        opacity: 1
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: Math.random() * 0.5
      }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor: `${color}30`,
          border: `1px solid ${color}`
        }}
        animate={{
          boxShadow: [
            `0 0 0 rgba(0,0,0,0)`,
            `0 0 8px ${color}90`,
            `0 0 2px ${color}30`
          ]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 rounded-full" 
        style={{ 
          backgroundColor: color 
        }}
      />
    </motion.div>
  );
};

export default CircleIndicator;