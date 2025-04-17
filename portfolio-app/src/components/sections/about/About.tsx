import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrando o plugin ScrollTrigger do GSAP
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  // Referências para animações GSAP
  const sectionRef = useRef<HTMLElement>(null);
  const skillChartRef = useRef<HTMLDivElement>(null);

  // Animação de scroll paralaxe
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transformações baseadas no progresso do scroll
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0, 1, 1, 0.8]);

  // Animação do gráfico radial de habilidades usando GSAP
  useEffect(() => {
    if (!skillChartRef.current) return;
    
    const skillLevels = skillChartRef.current.querySelectorAll('.skill-level');
    
    // Animação de entrada para cada nível de habilidade
    gsap.fromTo(skillLevels, 
      { scaleX: 0 },
      { 
        scaleX: 1, 
        duration: 1.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: skillChartRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);
  
  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <section id="about" ref={sectionRef} className="relative py-24 bg-[#0A0E17] overflow-hidden">
      {/* Grid de fundo decorativo */}
      <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-[0.03] pointer-events-none">
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="relative h-12 border-t border-l border-[#00E5FF]"></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Cabeçalho da seção */}
        <motion.div
          style={{ opacity, y }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-3">
            <span className="h-px w-8 bg-[#00E5FF] mr-3"></span>
            <span className="text-[#00E5FF] font-mono">SYSTEM.INFO</span>
            <span className="h-px w-8 bg-[#00E5FF] ml-3"></span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6EEF5] mb-3">
            Sobre <span className="text-[#00E5FF]">Gefferson</span>
          </h2>
          
          <p className="text-[#7A8899] max-w-2xl mx-auto">
            Especificações do sistema e runtime environment
          </p>
        </motion.div>
        
        {/* Grid principal do conteúdo */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Runtime Environment - Coluna esquerda */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-4 order-2 lg:order-1"
          >
            <div className="terminal-card bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5 h-full">
              <h3 className="text-[#00E5FF] font-mono text-xl mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-[#00E5FF] mr-2"></span>
                Runtime Environment
              </h3>
              
              <div className="space-y-6 font-mono">
                <div>
                  <div className="text-[#7A8899] text-sm mb-1">// Formação</div>
                  <div className="text-[#E6EEF5]">Análise e Desenvolvimento de Sistemas</div>
                  <div className="text-[#0CFF70] text-sm">Universidade Católica de Brasília, Goiânia</div>
                  <div className="text-[#7A8899] text-xs">2023 - 2025</div>
                </div>
                
                <div>
                  <div className="text-[#7A8899] text-sm mb-1">// Experiência Profissional</div>
                  <div className="text-[#E6EEF5]">Desenvolvedor Full Stack Pleno</div>
                  <div className="text-[#0CFF70] text-sm">Fox Digital Commodities, Goiânia</div>
                  <div className="text-[#7A8899] text-xs">2024 - Atualmente</div>
                </div>
                
                <div>
                  <div className="text-[#7A8899] text-sm mb-1">// Certificações</div>
                  <ul className="space-y-1 pl-4 list-disc text-[#E6EEF5] marker:text-[#BD00FF]">
                    <li>Formação Angular Developer <span className="text-[#7A8899] text-xs">[2023]</span></li>
                    <li>Full Stack Web Development <span className="text-[#7A8899] text-xs">[2023]</span></li>
                    <li>Programming w/ JavaScript, HTML, CSS <span className="text-[#7A8899] text-xs">[2022]</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Skill Chart - Coluna do meio */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-4 order-1 lg:order-2"
          >
            <div ref={skillChartRef} className="terminal-card bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5 h-full flex flex-col">
              <h3 className="text-[#00E5FF] font-mono text-xl mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-[#BD00FF] mr-2"></span>
                Core Capabilities
              </h3>
              
              <div className="space-y-4 flex-1 font-mono">
                {/* Gráfico de barras de habilidades */}
                <div className="skill-item">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#E6EEF5]">Node.js</span>
                    <span className="text-[#0CFF70]">90%</span>
                  </div>
                  <div className="h-2 rounded bg-[#1A1D27]/50">
                    <div className="skill-level h-full rounded bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] origin-left" style={{width: '90%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#E6EEF5]">Angular</span>
                    <span className="text-[#0CFF70]">85%</span>
                  </div>
                  <div className="h-2 rounded bg-[#1A1D27]/50">
                    <div className="skill-level h-full rounded bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] origin-left" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#E6EEF5]">RPA (Automação)</span>
                    <span className="text-[#0CFF70]">92%</span>
                  </div>
                  <div className="h-2 rounded bg-[#1A1D27]/50">
                    <div className="skill-level h-full rounded bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] origin-left" style={{width: '92%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#E6EEF5]">TypeScript</span>
                    <span className="text-[#0CFF70]">88%</span>
                  </div>
                  <div className="h-2 rounded bg-[#1A1D27]/50">
                    <div className="skill-level h-full rounded bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] origin-left" style={{width: '88%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#E6EEF5]">Docker & Kubernetes</span>
                    <span className="text-[#0CFF70]">80%</span>
                  </div>
                  <div className="h-2 rounded bg-[#1A1D27]/50">
                    <div className="skill-level h-full rounded bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] origin-left" style={{width: '80%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#E6EEF5]">MongoDB</span>
                    <span className="text-[#0CFF70]">85%</span>
                  </div>
                  <div className="h-2 rounded bg-[#1A1D27]/50">
                    <div className="skill-level h-full rounded bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] origin-left" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* System Architecture - Coluna direita */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-4 order-3"
          >
            <div className="terminal-card bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5 h-full">
              <h3 className="text-[#00E5FF] font-mono text-xl mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-[#0CFF70] mr-2"></span>
                System Architecture
              </h3>
              
              <div className="space-y-4 font-mono">
                <p className="text-[#E6EEF5]">
                  Desenvolvedor Full Stack com <span className="text-[#0CFF70]">+2 anos</span> de experiência em soluções web/mobile de alta performance, 
                  especializado em <span className="text-[#BD00FF]">Node.js</span>, <span className="text-[#BD00FF]">Angular</span> e 
                  <span className="text-[#BD00FF]"> automação de processos (RPA)</span>.
                </p>
                
                <div className="text-[#7A8899] text-sm mb-1">// Filosofia de Desenvolvimento</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[#00E5FF] mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-[#E6EEF5]">Código limpo e bem documentado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[#00E5FF] mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-[#E6EEF5]">Arquitetura escalável e modular</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[#00E5FF] mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-[#E6EEF5]">Automação para eliminar trabalho repetitivo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[#00E5FF] mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-[#E6EEF5]">Otimização contínua de performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[#00E5FF] mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="text-[#E6EEF5]">Foco em resultados mensuráveis</span>
                  </li>
                </ul>
                
                <div className="bg-[#0A0E17]/60 rounded p-3 border-l-2 border-[#BD00FF] mt-4">
                  <div className="text-[#7A8899] text-xs mb-1">// Missão</div>
                  <p className="text-[#E6EEF5] text-sm">
                    Criar soluções eficientes que transformam desafios em oportunidades de automatização, aumentando a produtividade e reduzindo custos operacionais.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Métricas de Destaque */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
        >
          <motion.div variants={cardVariants} className="stat-card bg-[#1A1D27]/70 rounded-lg p-5 border-l-2 border-[#00E5FF]">
            <div className="text-[#7A8899] text-xs mb-1 font-mono">// Automação de Processos</div>
            <div className="text-2xl font-bold text-[#00E5FF] mb-1">+80% Redução</div>
            <div className="text-[#E6EEF5] text-sm">em tempo de emissão de documentos fiscais</div>
          </motion.div>
          
          <motion.div variants={cardVariants} className="stat-card bg-[#1A1D27]/70 rounded-lg p-5 border-l-2 border-[#0CFF70]">
            <div className="text-[#7A8899] text-xs mb-1 font-mono">// Eficiência Logística</div>
            <div className="text-2xl font-bold text-[#0CFF70] mb-1">+25% Aumento</div>
            <div className="text-[#E6EEF5] text-sm">na eficiência através de dashboards de BI</div>
          </motion.div>
          
          <motion.div variants={cardVariants} className="stat-card bg-[#1A1D27]/70 rounded-lg p-5 border-l-2 border-[#BD00FF]">
            <div className="text-[#7A8899] text-xs mb-1 font-mono">// Custo Operacional</div>
            <div className="text-2xl font-bold text-[#BD00FF] mb-1">-15% Redução</div>
            <div className="text-[#E6EEF5] text-sm">em custos com arquitetura em microsserviços</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;