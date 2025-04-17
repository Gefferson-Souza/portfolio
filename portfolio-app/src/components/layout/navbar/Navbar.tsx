import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface NavbarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onTerminalToggle?: () => void;
}

export const Navbar = ({ 
  activeSection: propActiveSection = 'home',
  onSectionChange,
  onTerminalToggle
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [internalActiveSection, setInternalActiveSection] = useState(propActiveSection);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [bootSequence, setBootSequence] = useState(false);
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
  const navRef = useRef(null);
  
  const { scrollY } = useScroll();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  
  // Transformar opacidade e backdrop-blur da navbar baseado no scroll
  const navOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [6, 16]);
  const navScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const navBorderOpacity = useTransform(scrollY, [0, 50, 100], [0.2, 0.4, 0.6]);
  
  // Utilizamos o valor do prop se fornecido
  const activeSection = propActiveSection || internalActiveSection;
  
  // Handler para alterar seção ativa
  const handleSectionChange = useCallback((section: string) => {
    setInternalActiveSection(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  }, [onSectionChange]);
  
  // Efeito de inicialização do terminal
  useEffect(() => {
    // Iniciar a sequência de boot com um pequeno delay
    const bootTimer = setTimeout(() => {
      setBootSequence(true);
    }, 800);
    
    // Completar a sequência de boot
    const completeTimer = setTimeout(() => {
      setBootSequenceComplete(true);
    }, 2000);
    
    // Sequência de animação de inicialização
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 2500);
    
    // Limpar timeouts
    return () => {
      clearTimeout(bootTimer);
      clearTimeout(completeTimer);
      clearTimeout(initTimer);
    };
  }, []);
  
  // Efeito separado para animação do cursor piscante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 530);
    
    return () => {
      clearInterval(cursorInterval);
    };
  }, []);
  
  // Detectar seção ativa no scroll
  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'lab', 'stack', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Encontrar a seção atual baseada na posição do scroll
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offset = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offset && scrollPosition < offset + height) {
            handleSectionChange(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleSectionChange]);
  
  // Lista de navegação
  const navItems = [
    { id: 'home', label: 'home' },
    { id: 'about', label: 'about' },
    { id: 'projects', label: 'projects' },
    { id: 'lab', label: 'lab' },
    { id: 'stack', label: 'stack' },
    { id: 'contact', label: 'contact' }
  ];
  
  // Animações da inicialização do terminal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Animação para mobile menu
  const menuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren" 
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  // Animação de boot sequence
  const bootTextVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 1.2 
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.nav 
      ref={navRef}
      style={{ 
        opacity: navOpacity, 
        backdropFilter: `blur(${navBlur}px)`,
        scale: navScale,
        borderColor: `rgba(0, 229, 255, ${navBorderOpacity})`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 1.5
      }}
      className="fixed top-0 left-0 right-0 z-50 font-mono text-sm lg:text-base"
    >
      <div className="mx-auto px-4 py-3 bg-gradient-to-b from-[#0A0E17]/95 to-[#0A0E17]/80 border-b border-[#00E5FF]/30 shadow-lg shadow-[#00E5FF]/5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, x: [30, 0] }}
            transition={{ 
              delay: 0.8,
              duration: 0.7,
              ease: "easeOut" 
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] rounded-lg blur-md opacity-30"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <div className="text-[#00E5FF] font-bold text-lg relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0CFF70]">
                  {`{ GTS }`}
                </span>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="hidden md:flex items-center ml-4 space-x-1">
              <motion.span 
                className="h-1.5 w-1.5 rounded-full bg-[#0CFF70]"
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 1, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  times: [0, 0.2, 0.8, 1]
                }}
              />
              <span className="text-xs text-[#7A8899]">system online</span>
            </div>
          </motion.div>
          
          {/* Boot Sequence Animation */}
          <AnimatePresence>
            {bootSequence && !bootSequenceComplete && (
              <motion.div
                variants={bootTextVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#0CFF70] text-sm font-mono"
              >
                Initializing navigation system...
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Desktop Navigation */}
          {!isSmallScreen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInitialized ? "visible" : "hidden"}
              className="hidden md:block relative"
            >
              <motion.div 
                className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00E5FF]/10 rounded-lg blur-sm opacity-70"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <div className="flex items-center relative">
                <motion.span 
                  variants={itemVariants}
                  className="text-[#7A8899] mr-1"
                >
                  [gefferson<span className="text-[#00E5FF]">@</span>system]<span className="text-[#00E5FF]">$</span>
                </motion.span>
                <motion.span 
                  variants={itemVariants}
                  className="text-[#0CFF70] mr-1"
                >
                  navigate
                </motion.span>
                <motion.span 
                  variants={itemVariants}
                  className="text-[#7A8899] mr-1"
                >
                  --to
                </motion.span>
                
                {navItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    className="relative mx-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => handleSectionChange(item.id)}
                      className={`px-2 py-1 rounded-sm transition-all duration-200 ${
                        activeSection === item.id 
                          ? 'text-[#00E5FF] font-medium' 
                          : 'text-[#E6EEF5] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5'
                      }`}
                    >
                      "<span className="text-[#00E5FF]">{item.label}</span>"
                    </a>
                    {activeSection === item.id && (
                      <motion.div 
                        layoutId="navIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#0CFF70]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                ))}
                
                <motion.span 
                  variants={itemVariants}
                  className={`w-1.5 h-4 bg-[#00E5FF] ml-2 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`}
                  animate={{
                    backgroundColor: ['#00E5FF', '#0CFF70', '#00E5FF'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                ></motion.span>
              </div>
            </motion.div>
          )}
          
          {/* Terminal Toggle Button */}
          {onTerminalToggle && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onTerminalToggle}
              className="ml-4 px-3 py-1.5 rounded-md text-[#00E5FF] transition-all duration-300 relative group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button background effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00E5FF]/10 to-[#0CFF70]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 border border-[#00E5FF]/40 rounded-md group-hover:border-[#00E5FF]/70 transition-colors duration-300" />
              
              {/* Button content */}
              <div className="flex items-center relative">
                <span className="hidden md:block mr-1.5">Terminal</span>
                <span className="relative">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <motion.span 
                    className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-[#0CFF70]"
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </span>
              </div>
            </motion.button>
          )}
          
          {/* Mobile Menu Button */}
          {isSmallScreen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center p-2 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button glow effect */}
              <motion.div 
                className="absolute -inset-1 bg-[#00E5FF]/20 rounded-full blur-md opacity-0 group-hover:opacity-100"
                animate={{
                  opacity: isMenuOpen ? [0.2, 0.4, 0.2] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="h-5 w-5 relative">
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 8 : 0,
                    backgroundColor: isMenuOpen ? "#0CFF70" : "#00E5FF"
                  }}
                  className="absolute h-0.5 w-full bg-[#00E5FF] rounded-sm transform transition-all duration-300"
                />
                <motion.span
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                    width: isMenuOpen ? "0%" : "100%"
                  }}
                  transition={{
                    duration: 0.2
                  }}
                  className="absolute h-0.5 w-full bg-[#00E5FF] rounded-sm top-2 transition-all duration-300"
                />
                <motion.span
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? -8 : 0,
                    backgroundColor: isMenuOpen ? "#0CFF70" : "#00E5FF"
                  }}
                  className="absolute h-0.5 w-full bg-[#00E5FF] rounded-sm top-4 transform transition-all duration-300"
                />
              </div>
            </motion.button>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isSmallScreen && (
          <AnimatePresence mode="wait">
            {isMenuOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden mt-3 p-4 bg-gradient-to-b from-[#0A0E17]/95 to-[#0A0E17]/90 backdrop-blur-xl border border-[#00E5FF]/20 rounded-lg shadow-xl shadow-[#00E5FF]/10"
              >
                <div className="flex items-center mb-4 border-b border-[#00E5FF]/10 pb-2">
                  <span className="text-[#7A8899] mr-1">
                    [gefferson<span className="text-[#00E5FF]">@</span>system]<span className="text-[#00E5FF]">$</span>
                  </span>
                  <span className="text-[#0CFF70] mr-1">
                    navigate
                  </span>
                  <span className="text-[#7A8899] mr-1">
                    --to
                  </span>
                </div>
                
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={menuItemVariants}
                      className="py-2 border-b border-[#1A1D27] last:border-0"
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => {
                          handleSectionChange(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`block px-2 py-1.5 ${
                          activeSection === item.id 
                            ? 'text-[#00E5FF] bg-[#00E5FF]/5 rounded' 
                            : 'text-[#E6EEF5] hover:text-[#00E5FF]'
                        }`}
                      >
                        <span className="text-[#7A8899]">$</span>{" "}
                        "<span className={`${activeSection === item.id ? 'text-[#00E5FF]' : ''}`}>{item.label}</span>"
                        
                        {activeSection === item.id && (
                          <motion.span 
                            className="inline-block w-1.5 h-3 ml-2 bg-[#00E5FF]"
                            animate={{ opacity: cursorBlink ? 1 : 0 }}
                          />
                        )}
                      </a>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="h-0.5 w-full bg-gradient-to-r from-[#00E5FF]/30 to-transparent mt-4"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.nav>
  );
};