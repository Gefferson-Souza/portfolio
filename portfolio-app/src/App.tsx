import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Layout Components
import { Navbar } from './components/layout/navbar/Navbar';

// UI Components
import Terminal from './components/ui/terminal/Terminal';
import PageTransition from './components/ui/animations/PageTransition';
import ParticlesBackground from './components/ui/animations/ParticlesBackground';
import GlitchEffect from './components/ui/animations/GlitchEffect';

// Section Components
import Hero from './components/sections/hero/Hero';
import About from './components/sections/about/About';
import Stack from './components/sections/stack/Stack';
import Projects from './components/sections/projects/Projects';
import Lab from './components/sections/lab/Lab';
import Contact from './components/sections/contact/Contact';

// Hooks
import { useLoading } from './hooks/useLoading';
import { useMediaQuery } from './hooks/useMediaQuery';

function App() {
  const { isLoading, setLoading }:any = useLoading();
  const [activeSection, setActiveSection]:any = useState<string>('hero');
  const [terminalVisible, setTerminalVisible] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Comando para abrir/fechar o terminal
  const handleTerminalToggle = () => {
    setTerminalVisible(prev => !prev);
  };
  
  // Processar comandos digitados no terminal
  const handleCommandExecute = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'help') {
      // Comando de ajuda implementado no componente Terminal
    } else if (cmd.startsWith('goto ')) {
      const section = cmd.split(' ')[1];
      if (['hero', 'about', 'stack', 'projects', 'lab', 'contact'].includes(section)) {
        setActiveSection(section);
      }
    } else if (cmd === 'clear') {
      // Limpar terminal implementado no componente
    } else if (cmd === 'exit') {
      setTerminalVisible(false);
    }
  };
  
  // Iniciar sistema após efeito de loading
  useEffect(() => {
    if (!isLoading) {
      // Terminal aparece após 2 segundos do carregamento
      setTimeout(() => {
        setTerminalVisible(true);
      }, 2000);
    }
  }, [isLoading]);
  
  return (
    <div className="App bg-[#0A0E17] text-[#E6EEF5] min-h-screen relative overflow-hidden">
      {/* Animação de carregamento */}
      <PageTransition 
        isLoading={isLoading} 
        onLoadingComplete={() => setLoading(false)} 
      />
      
      {/* Fundo com partículas */}
      <ParticlesBackground 
        density={isMobile ? 0.5 : 1}
        className="opacity-50"
      />
      
      {/* Layout principal - só mostra após carregamento */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Navbar */}
            <Navbar 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onTerminalToggle={handleTerminalToggle}
            />
            
            {/* Conteúdo principal */}
            <main className="container mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                {activeSection === 'hero' && <Hero key="hero" />}
                {activeSection === 'about' && <About key="about" />}
                {activeSection === 'stack' && <Stack key="stack" />}
                {activeSection === 'projects' && <Projects key="projects" />}
                {activeSection === 'lab' && <Lab key="lab" />}
                {activeSection === 'contact' && <Contact key="contact" />}
              </AnimatePresence>
            </main>
            
            {/* Terminal flutuante */}
            <AnimatePresence>
              {terminalVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-50 max-w-md w-full"
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                  dragElastic={0.1}
                >
                  <Terminal
                    initialCommands={[
                      "Bem-vindo ao portfólio de Gefferson Souza!",
                      "Digite 'help' para ver os comandos disponíveis",
                      "Experimente 'goto projects' para navegar pelo site"
                    ]}
                    showHeader={true}
                    title={<>
                      <GlitchEffect text="terminal@gefferson" className="mr-1" /> 
                      <span className="text-[#00E5FF]">~</span>
                    </>}
                    onCommandExecute={handleCommandExecute}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Dica de terminal - só aparece uma vez no início */}
            {!terminalVisible && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="fixed bottom-4 right-4 bg-[#00E5FF]/10 text-[#00E5FF] p-3 rounded-lg border border-[#00E5FF]/30 z-40"
              >
                <button 
                  onClick={handleTerminalToggle}
                  className="flex items-center space-x-2 font-mono text-sm"
                >
                  <span>Abrir Terminal</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3" />
                  </svg>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
