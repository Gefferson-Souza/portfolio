import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText } from '../terminal/TerminalCursor';

interface PageTransitionProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  isLoading,
  onLoadingComplete
}) => {
  const [bootStep, setBootStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const bootMessages = [
    "Inicializando sistema...",
    "Carregando componentes visuais...",
    "Verificando dependências...",
    "Configurando ambiente...",
    "Estabelecendo conexão de rede...",
    "Carregando portfólio...",
    "Inicializando interface de usuário...",
    "Sistema online. Bem-vindo!"
  ];
  
  // Simular sequência de inicialização
  useEffect(() => {
    if (!isLoading) return;
    
    const bootSequence = async () => {
      // Simulando verificações de sistema
      for (let i = 0; i < bootMessages.length; i++) {
        setBootStep(i);
        
        // Tempo variável entre as mensagens de inicialização
        const delay = 500 + Math.random() * 700;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Pequena pausa antes de completar
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsComplete(true);
      
      // Transição final
      await new Promise(resolve => setTimeout(resolve, 1200));
      onLoadingComplete();
    };
    
    bootSequence();
  }, [isLoading, onLoadingComplete]);
  
  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };
  
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.9, 1],
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        repeatType: "loop" as const
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 }
    }
  };
  
  // Renderizar conteúdo condicional baseado no estado de carregamento
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0E17]"
        >
          <motion.div 
            variants={logoVariants}
            initial="hidden"
            animate={isComplete ? "pulse" : "visible"}
            exit="exit"
            className="mb-8"
          >
            <svg 
              viewBox="0 0 100 100" 
              width="80" 
              height="80"
              className="fill-[#00E5FF]"
            >
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
              <polygon 
                points="50,20 75,35 75,65 50,80 25,65 25,35" 
                className="fill-[#0A0E17]"
              />
              <text 
                x="50" 
                y="58" 
                textAnchor="middle" 
                className="fill-[#00E5FF] text-lg font-bold"
                style={{ fontSize: '16px' }}
              >
                G|S
              </text>
            </svg>
          </motion.div>
          
          <div className="w-full max-w-md bg-[#1A1D27]/70 p-6 rounded-lg border border-[#00E5FF]/20">
            <div className="terminal-output mb-6 h-40 overflow-hidden font-mono text-[#7A8899] text-sm space-y-1">
              {bootMessages.slice(0, bootStep + 1).map((message, index) => (
                <div key={index} className="flex">
                  <span className="text-[#0CFF70] mr-2">&gt;</span>
                  {index === bootStep ? (
                    <TypewriterText 
                      text={message}
                      typingSpeed={30}
                      cursorColor={index === bootMessages.length - 1 ? '#0CFF70' : '#00E5FF'}
                    />
                  ) : (
                    <span className="text-[#E6EEF5]">{message}</span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="relative w-full h-2 bg-[#1A1D27] rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00E5FF] to-[#0CFF70]"
                initial={{ width: "0%" }}
                animate={{ width: `${(bootStep / (bootMessages.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="mt-3 flex justify-between text-xs font-mono">
              <span className="text-[#00E5FF]">
                {Math.round((bootStep / (bootMessages.length - 1)) * 100)}%
              </span>
              <span className="text-[#7A8899]">
                {isComplete ? 'Carregamento completo' : 'Carregando...'}
              </span>
            </div>
          </div>
          
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-8 text-center"
            >
              <span className="font-mono text-[#00E5FF] text-sm">
                Pressione qualquer tecla para continuar
              </span>
              <div className="mt-2">
                <motion.span
                  animate={{ 
                    opacity: [1, 0, 1], 
                    transition: { duration: 1.5, repeat: Infinity } 
                  }}
                  className="inline-block w-2 h-5 bg-[#00E5FF]"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;