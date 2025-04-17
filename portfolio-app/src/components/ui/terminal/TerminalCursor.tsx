import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalCursorProps {
  color?: string;
  blinkSpeed?: number;
}

const TerminalCursor: React.FC<TerminalCursorProps> = ({ 
  color = '#00E5FF', 
  blinkSpeed = 530 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev);
    }, blinkSpeed);
    
    return () => clearInterval(interval);
  }, [blinkSpeed]);

  return (
    <motion.span
      className="inline-block h-4 w-1.5 relative bottom-px ml-0.5"
      style={{ 
        backgroundColor: color,
        opacity: visible ? 1 : 0,
      }}
    />
  );
};

export default TerminalCursor;

export const TypewriterText = ({
  text,
  typingSpeed = 50,
  startDelay = 0,
  cursorColor = '#0CFF70',
  className = '',
  onComplete,
}: {
  text: string;
  typingSpeed?: number;
  startDelay?: number;
  cursorColor?: string;
  className?: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let timer: any;

    const startTyping = () => {
      timer = setTimeout(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
          startTyping();
        } else {
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, typingSpeed);
    };

    const initialTimer = setTimeout(() => {
      startTyping();
    }, startDelay);
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timer);
    };
  }, [text, typingSpeed, startDelay, onComplete]);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <TerminalCursor color={cursorColor} />
    </div>
  );
};

export const CommandPrompt = ({
  username = 'visitor',
  hostname = 'portfolio',
  path = '~',
  command = '',
  showPrompt = true,
  className = '',
}: {
  username?: string;
  hostname?: string;
  path?: string;
  command?: string;
  showPrompt?: boolean;
  className?: string;
}) => {
  return (
    <div className={`font-mono ${className}`}>
      {showPrompt && (
        <span className="text-[#0CFF70]">
          [{username}@{hostname} {path}]$ 
        </span>
      )}{' '}
      <span className="text-[#E6EEF5]">{command}</span>
      <TerminalCursor />
    </div>
  );
};