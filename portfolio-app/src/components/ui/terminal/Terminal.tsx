import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchEffect from '../animations/GlitchEffect';
import TerminalCursor from './TerminalCursor';

interface TerminalProps {
  initialCommands?: string[];
  title?: React.ReactNode;
  showHeader?: boolean;
  onCommandExecute?: (command: string) => void;
}

// Cores do terminal
const COLORS = {
  bg: 'rgba(10, 14, 23, 0.90)',
  bgDark: 'rgba(8, 11, 18, 0.95)',
  bgGlow: 'rgba(0, 229, 255, 0.03)',
  border: 'rgba(0, 229, 255, 0.3)',
  borderHighlight: 'rgba(0, 229, 255, 0.6)',
  shadow: 'rgba(0, 229, 255, 0.15)',
  innerShadow: 'rgba(0, 0, 0, 0.3)',
  text: '#E6EEF5',
  primary: '#00E5FF',
  secondary: '#0CFF70',
  accent: '#BD00FF',
  error: '#FF5252',
  success: '#0CFF70',
  warning: '#FFCD00',
  muted: '#7A8899',
}

// Componente principal do terminal
const Terminal: React.FC<TerminalProps> = ({
  initialCommands = [],
  title = "terminal@gefferson",
  showHeader = true,
  onCommandExecute
}) => {
  // Estado para simular uma sequência de inicialização
  const [bootingUp, setBootingUp] = useState(true);
  const [bootSequence, setBootSequence] = useState(0);
  
  // Estado para armazenar histórico de comandos e saídas
  const [history, setHistory] = useState<Array<{
    type: 'input' | 'output' | 'error' | 'system' | 'welcome'; 
    content: string;
    id: number;
    highlight?: boolean;
  }>>(initialCommands.map((cmd, idx) => ({
    type: 'system',
    content: cmd,
    id: idx,
    highlight: false,
  })));
  
  // Estado para comando atual sendo digitado
  const [currentCommand, setCurrentCommand] = useState<string>('');
  
  // Estado para histórico de comandos
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Referência para input invisível e div do terminal
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // ID para cada item do histórico
  const [nextId, setNextId] = useState<number>(initialCommands.length);
  
  // Estado para efeito de escaneamento do terminal
  const [scanLine, setScanLine] = useState(0);
  
  // Efeito para a linha de escaneamento
  useEffect(() => {
    if (!bootingUp) {
      const interval = setInterval(() => {
        setScanLine(prev => (prev + 1) % 100);
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [bootingUp]);
  
  // Simulação de sequência de inicialização
  useEffect(() => {
    if (bootingUp) {
      const bootMessages = [
        { msg: "Iniciando sistema terminal v2.0.25...", delay: 600 },
        { msg: "Carregando módulos de interface...", delay: 800 },
        { msg: "Verificando credenciais de acesso...", delay: 700 },
        { msg: "Conectando ao servidor de portfólio...", delay: 900 },
        { msg: "Carregando preferências do usuário...", delay: 600 },
        { msg: "Sistema terminal pronto!", delay: 500 }
      ];
      
      const bootSequencer = async () => {
        // Pequeno delay inicial
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Adicionar cada mensagem com o delay especificado
        for (let i = 0; i < bootMessages.length; i++) {
          setBootSequence(i + 1);
          await new Promise(resolve => setTimeout(resolve, bootMessages[i].delay));
          
          // Adicionar a mensagem ao histórico
          if (i < bootMessages.length - 1) {
            addToHistory('system', bootMessages[i].msg, false);
          } else {
            // Última mensagem com destaque
            addToHistory('system', bootMessages[i].msg, true);
          }
        }
        
        // Adicionar message de boas-vindas após o boot
        await new Promise(resolve => setTimeout(resolve, 500));
        addToHistory('welcome', "Bem-vindo ao portfólio interativo de Gefferson Souza!", true);
        await new Promise(resolve => setTimeout(resolve, 300));
        addToHistory('welcome', "Use os comandos para navegar pelo sistema.", false);
        await new Promise(resolve => setTimeout(resolve, 200));
        addToHistory('welcome', "Digite 'help' para ver os comandos disponíveis.", false);
        
        // Finalizar a sequência de boot
        setBootingUp(false);
      };
      
      bootSequencer();
    }
  }, [bootingUp]);
  
  // Comandos disponíveis no terminal
  const availableCommands = {
    help: () => {
      addToHistory('output', `
┌─── COMANDOS DISPONÍVEIS ───────────────────┐
│                                            │
│  help ............ Exibe esta ajuda        │
│  clear ........... Limpa o terminal        │
│  exit ............ Fecha o terminal        │
│  goto [seção] .... Navega para uma seção   │
│  version ......... Versão do sistema       │
│  whoami .......... Info do usuário         │
│                                            │
└────────────────────────────────────────────┘
      `.trim(), true);
    },
    
    clear: () => {
      setHistory([]);
    },
    
    version: () => {
      addToHistory('output', `
┌─── INFORMAÇÕES DO SISTEMA ───┐
│                              │
│  Portfolio System v2.0.25    │
│  Build: 2025.04.16           │
│  Gefferson T. Souza          │
│  Full Stack Developer        │
│                              │
└──────────────────────────────┘
      `.trim(), true);
    },
    
    whoami: () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const formattedDate = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      addToHistory('output', `
┌─── SESSÃO DE USUÁRIO ──────────────┐
│                                    │
│  User: visitor@portfolio-system    │
│  Role: Explorador                  │
│  Permissões: view_projects,        │
│    contact_owner, explore          │
│                                    │
│  Início: ${formattedTime} - ${formattedDate}      │
│                                    │
└────────────────────────────────────┘
      `.trim(), true);
    },
    
    ['404']: (cmd: string) => {
      addToHistory('error', `Comando não reconhecido: '${cmd}'. Digite 'help' para ver os comandos disponíveis.`, false);
    }
  };
  
  // Função para adicionar mensagem ao histórico
  const addToHistory = useCallback((type: 'input' | 'output' | 'error' | 'system' | 'welcome', content: string, highlight: boolean = false) => {
    setHistory(prev => [...prev, { type, content, id: nextId, highlight }]);
    setNextId(prev => prev + 1);
  }, [nextId]);
  
  // Função para processar um comando
  const processCommand = useCallback((cmd: string) => {
    // Adicionar ao histórico
    addToHistory('input', `$ ${cmd}`, false);
    
    // Adicionar ao histórico de comandos para navegação com setas
    setCommandHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    
    // Executar comando
    if (cmd.toLowerCase() === 'help') {
      availableCommands.help();
    } else if (cmd.toLowerCase() === 'clear') {
      availableCommands.clear();
    } else if (cmd.toLowerCase() === 'version') {
      availableCommands.version();
    } else if (cmd.toLowerCase() === 'whoami') {
      availableCommands.whoami();
    } else if (cmd.toLowerCase().startsWith('goto ') || 
               cmd.toLowerCase() === 'exit') {
      // Esses comandos são tratados no componente App
      if (onCommandExecute) {
        onCommandExecute(cmd);
      }
    } else if (cmd.trim()) {
      availableCommands['404'](cmd);
    }
    
    // Limpar comando atual
    setCurrentCommand('');
  }, [addToHistory, onCommandExecute]);
  
  // Manipular entrada de teclado
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (bootingUp) return; // Ignorar entradas durante o boot
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentCommand.trim()) {
        processCommand(currentCommand.trim());
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  }, [currentCommand, historyIndex, commandHistory, processCommand, bootingUp]);
  
  // Focar no input ao clicar no terminal
  const focusInput = useCallback(() => {
    if (inputRef.current && !bootingUp) {
      inputRef.current.focus();
    }
  }, [bootingUp]);
  
  // Rolar para o fim do terminal ao adicionar conteúdo
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  // Manter foco no input
  useEffect(() => {
    if (!bootingUp) {
      focusInput();
    }
  }, [focusInput, bootingUp]);
  
  // Cores para diferentes tipos de mensagens
  const getColorForType = (type: string) => {
    switch (type) {
      case 'input': return COLORS.secondary;
      case 'error': return COLORS.error;
      case 'system': return COLORS.primary;
      case 'welcome': return COLORS.accent;
      default: return COLORS.text;
    }
  };
  
  // Terminal UI enriquecido
  return (
    <motion.div
      className="rounded-lg overflow-hidden backdrop-blur-md"
      style={{
        boxShadow: `0 10px 30px ${COLORS.shadow}, 0 0 30px ${COLORS.shadow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
        border: `1px solid ${COLORS.border}`,
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={focusInput}
    >
      {/* Cabeçalho do terminal com design melhorado */}
      {showHeader && (
        <div 
          className="flex items-center justify-between px-4 py-2 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(180deg, ${COLORS.bgDark}, ${COLORS.bg})`,
            borderBottom: `1px solid ${COLORS.border}`
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-red-500 relative group"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              >
                <motion.span 
                  className="absolute inset-0 rounded-full bg-red-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.8, 0], scale: [0.8, 1.5] }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    repeatType: "loop"
                  }}
                />
              </motion.div>
              <motion.div 
                className="w-3 h-3 rounded-full bg-yellow-500 relative"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-green-500 relative"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
              >
                <motion.span 
                  className="absolute inset-0 rounded-full bg-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.8, 0], scale: [0.8, 1.5] }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 1.5,
                    repeatType: "loop",
                    delay: 0.5
                  }}
                />
              </motion.div>
            </div>
            <div className="ml-4 font-mono text-sm flex items-center">
              {typeof title === 'string' ? (
                <GlitchEffect text={title} color={COLORS.text} highlightColor={COLORS.primary} />
              ) : (
                title
              )}
            </div>
          </div>
          
          {/* Status do terminal */}
          <div className="flex items-center space-x-3">
            <div className="text-xs flex items-center space-x-1">
              <motion.span 
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: bootingUp ? COLORS.warning : COLORS.success }}
                animate={{ 
                  opacity: bootingUp ? [1, 0.5, 1] : 1
                }}
                transition={{ 
                  duration: 1, 
                  repeat: bootingUp ? Infinity : 0 
                }}
              />
              <span style={{ color: COLORS.muted }}>
                {bootingUp ? "inicializando..." : "online"}
              </span>
            </div>
            
            <div 
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ 
                color: COLORS.text,
                backgroundColor: COLORS.bgDark,
                border: `1px solid ${COLORS.border}`
              }}
            >
              v2.0.25
            </div>
          </div>
          
          {/* Linha decorativa de gradiente */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      )}
      
      {/* Conteúdo do terminal com efeitos visuais */}
      <div 
        className="relative"
        style={{ backgroundColor: COLORS.bgDark }}
      >
        {/* Efeito de glow ao redor do conteúdo */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${COLORS.bgGlow}, transparent 70%)`,
            pointerEvents: 'none'
          }}
        />
        
        {/* Efeito de scanline animado */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-10"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)`,
          }}
        >
          <motion.div 
            className="absolute left-0 right-0 h-20 mix-blend-overlay"
            style={{
              background: `linear-gradient(180deg, transparent, ${COLORS.primary}44 50%, transparent)`,
              top: `${scanLine}%`,
            }}
          />
        </div>
        
        {/* Conteúdo principal do terminal */}
        <div 
          ref={terminalRef}
          className="font-mono text-sm p-4 overflow-y-auto relative z-0"
          style={{ 
            maxHeight: '350px',
            minHeight: '300px',
            color: COLORS.text,
            boxShadow: `inset 0 0 20px ${COLORS.innerShadow}`
          }}
        >
          {/* Indicador de boot */}
          {bootingUp && (
            <div className="absolute top-0 left-0 right-0 py-2 z-30 flex justify-between items-center px-4">
              <div
                className="text-xs font-semibold"
                style={{ color: COLORS.primary }}
              >
                Terminal OS v2.0.25
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-xs" style={{ color: COLORS.muted }}>
                  Inicialização do Sistema
                </div>
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.bgDark }}>
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: COLORS.primary }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(bootSequence / 6) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Histórico de comandos e saídas com animações */}
          <AnimatePresence mode="popLayout">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)',
                  transition: { type: 'spring', stiffness: 120, damping: 14 }
                }}
                exit={{ opacity: 0, x: -10 }}
                className={`mb-2 ${item.highlight ? 'px-3 py-2 rounded' : ''}`}
                style={{
                  color: getColorForType(item.type),
                  backgroundColor: item.highlight ? COLORS.bgGlow : 'transparent',
                  borderLeft: item.highlight ? `2px solid ${getColorForType(item.type)}` : 'none'
                }}
              >
                {/* Solução definitiva para o problema de chaves */}
                {item.content.split('\n').map((line, lineIndex) => (
                  <div key={`${item.id}-line-${lineIndex}`} className="break-words whitespace-pre-wrap">{line}</div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Linha de comando atual com elementos interativos */}
          {!bootingUp && (
            <motion.div 
              className="flex items-center mt-3 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                style={{ color: COLORS.secondary }}
                className="mr-2 group-hover:text-[#0CFF70]"
              >
                $
              </motion.span>
              <span className="relative">
                {currentCommand}
                <TerminalCursor color={COLORS.primary} />
              </span>
              
              {/* Input invisível para capturar a digitação */}
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 top-0 left-0 w-1 h-1"
                autoFocus
                aria-label="Terminal input"
              />
            </motion.div>
          )}
        </div>
        
        {/* Rodapé sutil do terminal */}
        <div 
          className="px-3 py-2 text-right text-xs border-t relative overflow-hidden"
          style={{ 
            borderColor: COLORS.border,
            color: COLORS.muted,
            background: `linear-gradient(0deg, ${COLORS.bgDark}, ${COLORS.bg})`,
          }}
        >
          {/* Linha decorativa de gradiente no topo do rodapé */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.5
            }}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <motion.span 
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: COLORS.primary }}
                animate={{ 
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <span>Terminal ativo</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>↑↓</span>
              <span>histórico</span>
              <span className="text-[#00E5FF]">|</span>
              <span>Enter</span>
              <span>executar</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Terminal;