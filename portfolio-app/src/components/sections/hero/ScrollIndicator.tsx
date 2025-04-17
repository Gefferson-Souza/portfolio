import React from 'react';
import { motion } from 'framer-motion';

export const ScrollIndicator: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center text-[#7A8899] cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      whileHover={{ scale: 1.1, color: '#00E5FF' }}
    >
      <span className="text-xs mb-2 font-mono">scroll</span>
      <motion.div
        className="w-5 h-8 border-2 border-current rounded-full flex items-start justify-center p-1"
      >
        <motion.div
          className="w-1 h-1.5 bg-current rounded-full"
          animate={{ 
            y: [0, 12, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;