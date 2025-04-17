import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlitchEffectProps {
  text: string;
  color?: string;
  highlightColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const GlitchEffect: React.FC<GlitchEffectProps> = ({
  text,
  color = '#E6EEF5',
  highlightColor = '#00E5FF',
  intensity = 'medium',
  className = ''
}) => {
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [glitchedText, setGlitchedText] = useState<string>(text);

  // Configuração de intensidade do glitch
  const glitchConfig = {
    low: {
      interval: 5000,
      duration: 50,
      chance: 0.2,
      chars: '!<>-_\\/[]{}—=+*^?#'
    },
    medium: {
      interval: 3000,
      duration: 70,
      chance: 0.4,
      chars: '!<>-_\\/[]{}—=+*^?#$%&()~'
    },
    high: {
      interval: 2000,
      duration: 100,
      chance: 0.6,
      chars: '!<>-_\\/[]{}—=+*^?#$%&()~`|'
    }
  };

  const config = glitchConfig[intensity];

  // Função para gerar texto glitchado
  const generateGlitchedText = () => {
    if (!isGlitching) return text;

    return text
      .split('')
      .map(char => {
        // Chance aleatória de substituir o caractere
        if (Math.random() < config.chance) {
          const randomChar = config.chars.charAt(Math.floor(Math.random() * config.chars.length));
          return randomChar;
        }
        return char;
      })
      .join('');
  };

  // Efeito para atualizar o texto glitchado
  useEffect(() => {
    if (!isGlitching) return;
    
    const glitchInterval = setInterval(() => {
      setGlitchedText(generateGlitchedText());
    }, 50);

    // Limpar intervalo após a duração
    const endGlitchTimeout = setTimeout(() => {
      clearInterval(glitchInterval);
      setIsGlitching(false);
      setGlitchedText(text);
    }, config.duration);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(endGlitchTimeout);
    };
  }, [isGlitching, text]);

  // Efeito para iniciar glitch em intervalos
  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, config.duration);
    };
    
    const interval = setInterval(triggerGlitch, config.interval);
    
    // Trigger inicial após uma pausa
    const initialTimeout = setTimeout(triggerGlitch, 1000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [config.interval, config.duration]);

  return (
    <motion.span
      className={`inline-block font-mono relative ${className}`}
      style={{ color }}
    >
      {glitchedText}
      
      {/* Efeitos de overlay */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute top-0 left-0 w-full"
            style={{
              color: highlightColor,
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: 'translateX(-2px)',
              opacity: 0.8
            }}
          >
            {glitchedText}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 w-full"
            style={{
              color: 'rgba(255,80,100,0.8)',
              clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)',
              transform: 'translateX(2px)',
              opacity: 0.8
            }}
          >
            {glitchedText}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};

export default GlitchEffect;