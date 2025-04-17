import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import TerminalCursor from '../../ui/terminal/TerminalCursor';

interface FormState {
  name: string;
  email: string;
  message: string;
  submitted: boolean;
  submitting: boolean;
  error: string | null;
}

const Contact = () => {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    submitted: false,
    submitting: false,
    error: null
  });
  
  const [currentField, setCurrentField] = useState<'name' | 'email' | 'message' | 'done'>('name');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Iniciando sistema de contato...",
    "Conexão estabelecida.",
    "Digite seus dados para iniciar:"
  ]);
  
  const [confettiActive, setConfettiActive] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Lidar com submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.submitting) return;
    
    // Validação básica
    if (!formState.name || !formState.email || !formState.message) {
      setFormState(prev => ({
        ...prev,
        error: "Todos os campos devem ser preenchidos!"
      }));
      
      addToHistory("ERRO: Todos os campos devem ser preenchidos!");
      return;
    }
    
    if (!formState.email.includes('@')) {
      setFormState(prev => ({
        ...prev,
        error: "Email inválido!"
      }));
      
      addToHistory("ERRO: Formato de email inválido!");
      return;
    }
    
    setFormState(prev => ({
      ...prev,
      submitting: true,
      error: null
    }));
    
    addToHistory(`Enviando mensagem: ${formState.message.substring(0, 40)}${formState.message.length > 40 ? '...' : ''}`);
    
    // Simulação de envio (substituir por API real)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sucesso!
    setFormState(prev => ({
      ...prev,
      submitted: true,
      submitting: false
    }));
    
    addToHistory("Mensagem enviada com sucesso!");
    addToHistory("Obrigado pelo contato!");
    
    // Ativar confete
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };
  
  // Adicionar linha ao histórico do terminal
  const addToHistory = (line: string) => {
    setTerminalHistory(prev => [...prev, line]);
    
    // Scroll para o final do terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };
  
  // Lidar com input nos campos
  const handleFieldInput = (field: 'name' | 'email' | 'message', value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Avançar para o próximo campo
  const advanceToNextField = () => {
    if (currentField === 'name') {
      if (!formState.name.trim()) {
        addToHistory("ERRO: Nome não pode estar vazio!");
        return;
      }
      
      setCurrentField('email');
      addToHistory(`Nome registrado: ${formState.name}`);
      addToHistory("Digite seu email:");
    } 
    else if (currentField === 'email') {
      if (!formState.email.trim() || !formState.email.includes('@')) {
        addToHistory("ERRO: Email inválido!");
        return;
      }
      
      setCurrentField('message');
      addToHistory(`Email registrado: ${formState.email}`);
      addToHistory("Digite sua mensagem:");
    } 
    else if (currentField === 'message') {
      if (!formState.message.trim()) {
        addToHistory("ERRO: Mensagem não pode estar vazia!");
        return;
      }
      
      setCurrentField('done');
      addToHistory(`Mensagem registrada: ${formState.message.substring(0, 40)}${formState.message.length > 40 ? '...' : ''}`);
      addToHistory("Pressione ENVIAR para completar ou EDITAR para fazer alterações.");
    }
  };
  
  // Reiniciar o formulário
  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      message: '',
      submitted: false,
      submitting: false,
      error: null
    });
    
    setCurrentField('name');
    setTerminalHistory([
      "Sistema reiniciado.",
      "Digite seus dados para iniciar:"
    ]);
  };
  
  // Efeito para scroll automático
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);
  
  // Variantes de animação
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  };
  
  // Renderização condicional do prompt baseado no campo atual
  const renderPrompt = () => {
    const promptVariants = {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1, 
        transition: { duration: 0.3 } 
      },
      exit: { 
        opacity: 0,
        transition: { duration: 0.2 }
      }
    };
    
    if (currentField === 'name') {
      return (
        <motion.div 
          className="flex items-center"
          variants={promptVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <span className="text-[#0CFF70] mr-2 font-mono">[visitor@gefferson-system ~]$</span>
          <span className="text-[#00E5FF] mr-2 font-mono">name:</span>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => handleFieldInput('name', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && advanceToNextField()}
            className="bg-transparent border-none text-[#E6EEF5] outline-none font-mono flex-1"
            autoFocus
          />
          <TerminalCursor />
        </motion.div>
      );
    }
    
    if (currentField === 'email') {
      return (
        <motion.div 
          className="flex items-center"
          variants={promptVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <span className="text-[#0CFF70] mr-2 font-mono">[visitor@gefferson-system ~]$</span>
          <span className="text-[#00E5FF] mr-2 font-mono">email:</span>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => handleFieldInput('email', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && advanceToNextField()}
            className="bg-transparent border-none text-[#E6EEF5] outline-none font-mono flex-1"
            autoFocus
          />
          <TerminalCursor />
        </motion.div>
      );
    }
    
    if (currentField === 'message') {
      return (
        <motion.div 
          className="flex items-start"
          variants={promptVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <span className="text-[#0CFF70] mr-2 font-mono">[visitor@gefferson-system ~]$</span>
          <span className="text-[#00E5FF] mr-2 font-mono">message:</span>
          <div className="flex-1">
            <textarea
              value={formState.message}
              onChange={(e) => handleFieldInput('message', e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  advanceToNextField();
                }
              }}
              className="bg-transparent border-none text-[#E6EEF5] outline-none font-mono w-full resize-none"
              rows={3}
              autoFocus
              placeholder="Digite sua mensagem (Ctrl+Enter para confirmar)"
            />
            <div className="flex justify-between text-xs text-[#7A8899]">
              <span>{formState.message.length} caracteres</span>
              <span>Ctrl+Enter para concluir</span>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (currentField === 'done') {
      return (
        <motion.div 
          className="flex items-center justify-center space-x-3"
          variants={promptVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <button
            onClick={handleSubmit}
            disabled={formState.submitting}
            className={`px-4 py-2 rounded font-mono text-sm ${
              formState.submitting
                ? 'bg-[#1A1D27]/60 text-[#7A8899] cursor-not-allowed'
                : 'bg-[#0CFF70] text-[#0A0E17] hover:bg-[#0CFF70]/90'
            } transition-all duration-300`}
          >
            {formState.submitting ? '[ Enviando... ]' : '[ Enviar Mensagem ]'}
          </button>
          
          <button
            onClick={() => setCurrentField('name')}
            disabled={formState.submitting}
            className="px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#00E5FF] rounded font-mono text-sm hover:bg-[#1A1D27]/70 transition-all duration-300"
          >
            [ Editar Dados ]
          </button>
        </motion.div>
      );
    }
    
    return null;
  };
  
  return (
    <section id="contact" className="bg-[#0A0E17] py-24">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="h-px w-8 bg-[#00E5FF] mr-3"></span>
            <span className="text-[#00E5FF] font-mono">SYSTEM.CONNECT</span>
            <span className="h-px w-8 bg-[#00E5FF] ml-3"></span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6EEF5] mb-3">
            <span className="text-[#00E5FF]">Conecte-se</span> Comigo
          </h2>
          
          <p className="text-[#7A8899] max-w-2xl mx-auto">
            Terminal de comunicação para iniciar uma conversa ou projeto
          </p>
        </div>
        
        {/* Conteúdo principal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-[#1A1D27] rounded-lg overflow-hidden border border-[#00E5FF]/20">
              {/* Barra superior */}
              <div className="bg-[#0A0E17] px-4 py-2 flex items-center space-x-2 border-b border-[#00E5FF]/20">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                <div className="ml-4 text-[#7A8899] font-mono text-sm">contact-terminal -- gefferson@system</div>
              </div>
              
              {/* Terminal */}
              <form onSubmit={handleSubmit} className="p-4">
                {/* Histórico do terminal */}
                <div
                  ref={terminalRef} 
                  className="font-mono text-sm mb-6 max-h-[300px] overflow-y-auto"
                >
                  {terminalHistory.map((line, i) => (
                    <div key={i} className="mb-1 text-[#7A8899]">{line}</div>
                  ))}
                </div>
                
                {/* Prompt atual */}
                {!formState.submitted ? renderPrompt() : (
                  <div className="text-center space-y-4">
                    <div className="text-[#0CFF70] font-mono">
                      Mensagem enviada com sucesso! Entrarei em contato em breve.
                    </div>
                    
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#00E5FF] rounded font-mono text-sm hover:bg-[#1A1D27]/70 transition-all duration-300"
                    >
                      [ Enviar Nova Mensagem ]
                    </button>
                  </div>
                )}
                
                {/* Mensagem de erro */}
                {formState.error && (
                  <div className="mt-2 text-[#FF5F57] font-mono text-sm">
                    {formState.error}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
          
          {/* Links sociais */}
          <motion.div variants={itemVariants}>
            <div className="font-mono text-[#7A8899] mb-2 text-sm">
              <span className="mr-2">[system]$</span>
              <span>connect --to</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://github.com/gefferson-souza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#E6EEF5] rounded-md hover:bg-[#1A1D27]/70 hover:border-[#00E5FF]/40 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              
              <a 
                href="https://www.linkedin.com/in/geffersontesouza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#E6EEF5] rounded-md hover:bg-[#1A1D27]/70 hover:border-[#00E5FF]/40 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              
              <a 
                href="https://wa.me/5561999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#E6EEF5] rounded-md hover:bg-[#1A1D27]/70 hover:border-[#00E5FF]/40 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              
              <a 
                href="mailto:geffersonteodorodesouza@gmail.com" 
                className="flex items-center px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#E6EEF5] rounded-md hover:bg-[#1A1D27]/70 hover:border-[#00E5FF]/40 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
                </svg>
                Email
              </a>
            </div>
          </motion.div>
          
          {/* Efeito Confetti */}
          {confettiActive && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    top: `${Math.random() * -10}%`,
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#00E5FF', '#0CFF70', '#BD00FF'][Math.floor(Math.random() * 3)],
                    animation: `confetti-fall ${1 + Math.random() * 3}s linear forwards`,
                    animationDelay: `${Math.random() * 1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Estilos para animação de confetti */}
      <style >{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(${Math.random() * 100 + 600}px) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;