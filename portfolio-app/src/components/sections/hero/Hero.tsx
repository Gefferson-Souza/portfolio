import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import TerminalCursor from '../../ui/terminal/TerminalCursor';
import { ParticlesBackground } from './ParticlesBackground';
import { CircleIndicator } from './CircleIndicator';
import { ScrollIndicator } from './ScrollIndicator';

// Inspirado em designs de portfólios premium e sites como awwwards.com
const Hero = () => {
  // Estado para animação de digitação
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Texto para animação de digitação
  const terminalLines = [
    '> Inicializando sistema...',
    '> Usuário: Gefferson Souza',
    '> Função: Backend Engineer & Automation Specialist',
    '> Status: Disponível para projetos inovadores',
    '> Comando: ./mostrar_habilidades.sh'
  ];

  // Efeito para acompanhar posição do mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito de digitação de terminal
  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const currentLine = terminalLines[currentLineIndex];
      
      // Se ainda não terminou de digitar a linha atual
      if (currentCharIndex < currentLine.length) {
        const typingSpeed = Math.random() * 50 + 30; // Velocidade variável
        
        const typingTimeout = setTimeout(() => {
          setCurrentCharIndex(prevCharIndex => prevCharIndex + 1);
        }, typingSpeed);
        
        return () => clearTimeout(typingTimeout);
      } 
      // Se terminou de digitar a linha atual, prepare a próxima linha
      else {
        const newDisplayedLines = [...displayedLines];
        newDisplayedLines[currentLineIndex] = currentLine;
        
        const lineDelay = currentLine.includes('Comando') ? 800 : 400;
        
        const nextLineTimeout = setTimeout(() => {
          setDisplayedLines(newDisplayedLines);
          setCurrentLineIndex(prevIndex => prevIndex + 1);
          setCurrentCharIndex(0);
        }, lineDelay);
        
        return () => clearTimeout(nextLineTimeout);
      }
    } else if (!typingComplete && currentLineIndex >= terminalLines.length) {
      setTypingComplete(true);
    }
  }, [currentLineIndex, currentCharIndex, displayedLines, terminalLines, typingComplete]);

  // Rolagem automática do terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines]);
  
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-[#0A0E17]">
      {/* Partículas do fundo com efeito parallax */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ParticlesBackground mousePosition={mousePosition} />
        </Canvas>
      </div>
      
      {/* Grade decorativa */}
      <div 
        className="absolute inset-0 z-0 opacity-5" 
        style={{
          backgroundImage: "linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)",
          backgroundSize: "clamp(20px, 5vw, 40px) clamp(20px, 5vw, 40px)"
        }}
      />
      
      {/* Content Container */}
      <div className="container relative z-10 mx-auto h-screen flex flex-col">
        {/* Layout principal dividido em duas colunas */}
        <div className="flex flex-col md:flex-row h-full items-center px-6 md:px-10 py-24 md:py-0">
          {/* Coluna da esquerda - Informações */}
          <motion.div 
            className="w-full md:w-1/2 space-y-6 md:pr-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            {/* Tag de status */}
            <motion.div 
              className="inline-flex items-center px-3 py-1 space-x-1 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-[#0CFF70] animate-pulse"></span>
              <span className="text-sm text-[#7A8899]">Disponível para projetos</span>
            </motion.div>
            
            {/* Nome e função */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-[#E6EEF5]">Gefferson </span>
                <span className="bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] bg-clip-text text-transparent">Souza</span>
              </h1>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold text-[#E6EEF5]/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Back End & <span className="text-[#0CFF70]">Automação</span> Specialist
              </motion.h2>
            </div>
            
            {/* Bio curta */}
            <motion.p 
              className="text-[#7A8899] text-lg max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Desenvolvendo soluções eficientes, interfaces intuitivas e código limpo e escalável 
              para empresas que valorizam qualidade e inovação.
            </motion.p>
            
            {/* Botões CTA */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a 
                href="#projects" 
                className="relative px-7 py-3 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] rounded-lg"></span>
                <span className="relative flex items-center justify-center space-x-2 text-black font-medium">
                  <span>Ver Projetos</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </span>
              </a>
              
              <a 
                href="#contact" 
                className="relative px-7 py-3 group overflow-hidden"
              >
                <span className="absolute inset-0 border border-[#00E5FF] rounded-lg"></span>
                <span className="relative flex items-center text-[#00E5FF] font-medium">
                  Contato
                </span>
              </a>
            </motion.div>
            
            {/* Tech tags */}
            <div className="pt-6">
              <motion.p 
                className="text-sm text-[#7A8899] mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Tecnologias principais
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {['Node.js', 'TypeScript', 'MongoDB', 'RabbitMQ', 'Docker', 'Kubernetes'].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="px-3 py-1 text-xs font-medium bg-[#1A1D27] text-[#E6EEF5] rounded-full border border-[#1A1D27] hover:border-[#00E5FF]/30 transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Coluna da direita - Terminal */}
          <motion.div 
            className="w-full md:w-1/2 mt-12 md:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            {/* Terminal Card */}
            <div className="relative">
              {/* Background elements */}
              <motion.div 
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#BD00FF]/20 to-[#0CFF70]/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <motion.div 
                className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full bg-[#00E5FF]/20 blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 4,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            
              {/* Terminal Window */}
              <div className="terminal-window rounded-lg overflow-hidden bg-[#0A0E17] border border-[#00E5FF]/30 shadow-[0_0_25px_rgba(0,229,255,0.15)]">
                <div className="terminal-header bg-[#1A1D27] p-3 flex items-center">
                  <div className="window-controls flex space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#FC615D]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FDBC40]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#34C749]"></span>
                  </div>
                  <div className="terminal-title text-center flex-1 text-[#7A8899] text-xs">
                    ~/gefferson-system/portfolio.sh
                  </div>
                </div>
                
                <div 
                  ref={terminalRef}
                  className="terminal-body p-4 font-mono text-sm h-[350px] overflow-y-auto bg-[#0A0E17]"
                >
                  {/* Linhas já "digitadas" completamente */}
                  {displayedLines.map((line, index) => (
                    <motion.div 
                      key={`line-${index}`} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-2 text-[#E6EEF5]"
                    >
                      {line}
                    </motion.div>
                  ))}
                  
                  {/* Linha atual sendo "digitada" */}
                  {currentLineIndex < terminalLines.length && (
                    <div className="mb-2 text-[#E6EEF5]">
                      {terminalLines[currentLineIndex].substring(0, currentCharIndex)}
                      <TerminalCursor />
                    </div>
                  )}
                  
                  {/* Saída final após completar a digitação */}
                  {typingComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="mb-2 text-[#0CFF70]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        carregando... portfolio.system v2.0.25
                      </motion.div>
                      <motion.div 
                        className="mb-2 text-[#BD00FF]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        inicializando módulos de experiência e projetos...
                      </motion.div>
                      <motion.div 
                        className="mb-2 text-[#00E5FF]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        bem-vindo ao meu portfólio interativo!
                      </motion.div>
                      <motion.div 
                        className="mb-2 text-[#7A8899]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                      >
                        navegue para explorar...
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Elementos decorativos */}
              <CircleIndicator 
                position={{ top: '-15px', left: '-15px' }} 
                size="30px"
                color="#00E5FF"
              />
              <CircleIndicator 
                position={{ bottom: '-10px', right: '40px' }} 
                size="20px"
                color="#0CFF70"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Indicador de rolar para baixo */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -20 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollIndicator />
        </motion.div>
      </div>
      
      {/* Links sociais */}
      <div className="fixed left-6 bottom-0 z-20 hidden md:block">
        <motion.div 
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.a 
            href="https://www.linkedin.com/in/geffersontesouza" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#7A8899] hover:text-[#00E5FF] transition-colors duration-300"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </motion.a>
          
          <motion.a 
            href="https://github.com/gefferson-souza" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#7A8899] hover:text-[#00E5FF] transition-colors duration-300"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </motion.a>
          
          <motion.a 
            href="#contact"
            className="text-[#7A8899] hover:text-[#00E5FF] transition-colors duration-300"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </motion.a>
          
          <div className="h-24 w-px bg-gradient-to-b from-[#7A8899]/0 via-[#7A8899]/40 to-[#7A8899]/0"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;