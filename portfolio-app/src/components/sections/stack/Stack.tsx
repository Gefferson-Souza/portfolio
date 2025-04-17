import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Interface para os dados de tecnologia
interface TechItem {
  name: string;
  category: string;
  proficiency: number; // 0-1
  experience: number; // anos de experiência
  color: string;
  description?: string;
}

const Stack = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const radarRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  
  // Categorias de tecnologia
  const categories = [
    { id: 'all', name: 'Todas', color: '#00E5FF' },
    { id: 'backend', name: 'Backend', color: '#0CFF70' },
    { id: 'frontend', name: 'Frontend', color: '#FF61F6' },
    { id: 'devops', name: 'DevOps', color: '#BD00FF' },
    { id: 'database', name: 'Banco de Dados', color: '#FF5757' },
    { id: 'automation', name: 'Automação', color: '#FFC837' },
  ];
  
  // Dados de tecnologias
  const techData: TechItem[] = [
    // Backend
    { name: 'Node.js', category: 'backend', proficiency: 0.9, experience: 2, color: '#43853D', 
      description: 'Desenvolvimento de APIs REST, microsserviços e automações com Node.js' },
    { name: 'NestJS', category: 'backend', proficiency: 0.85, experience: 1.5, color: '#E0234E',
      description: 'Framework para construção de aplicações backend escaláveis e manuteníveis' },
    { name: 'Express', category: 'backend', proficiency: 0.9, experience: 2, color: '#000000',
      description: 'Framework web minimalista e flexível para Node.js' },
    { name: 'TypeScript', category: 'backend', proficiency: 0.88, experience: 2, color: '#007ACC',
      description: 'Superset de JavaScript com tipagem estática para desenvolvimento robusto' },
    { name: 'Python', category: 'backend', proficiency: 0.75, experience: 1, color: '#3776AB',
      description: 'Usado para scripts de automação e análise de dados' },
    
    // Frontend
    { name: 'React', category: 'frontend', proficiency: 0.8, experience: 1.5, color: '#61DAFB',
      description: 'Biblioteca JavaScript para construção de interfaces de usuário' },
    { name: 'Angular', category: 'frontend', proficiency: 0.85, experience: 2, color: '#DD0031',
      description: 'Framework de aplicações web e mobile com TypeScript' },
    { name: 'HTML/CSS', category: 'frontend', proficiency: 0.9, experience: 3, color: '#E34F26',
      description: 'Linguagens fundamentais para desenvolvimento web' },
    { name: 'TailwindCSS', category: 'frontend', proficiency: 0.85, experience: 1.5, color: '#06B6D4',
      description: 'Framework CSS utilitário para design rápido e responsivo' },
    { name: 'SASS', category: 'frontend', proficiency: 0.82, experience: 2, color: '#CC6699',
      description: 'Pré-processador CSS para estilos mais organizados e manuteníveis' },
    
    // DevOps
    { name: 'Docker', category: 'devops', proficiency: 0.8, experience: 1.5, color: '#2496ED',
      description: 'Plataforma para desenvolvimento, envio e execução de aplicações em containers' },
    { name: 'Kubernetes', category: 'devops', proficiency: 0.75, experience: 1, color: '#326CE5',
      description: 'Orquestração de containers para automatizar implantação e gerenciamento de aplicações' },
    { name: 'CI/CD', category: 'devops', proficiency: 0.85, experience: 1.5, color: '#4CAF50',
      description: 'Pipelines de integração e entrega contínua para automação de deploys' },
    { name: 'Git', category: 'devops', proficiency: 0.9, experience: 3, color: '#F05032',
      description: 'Sistema de controle de versão para rastreamento de alterações de código' },
    
    // Database
    { name: 'MongoDB', category: 'database', proficiency: 0.85, experience: 2, color: '#47A248',
      description: 'Banco de dados NoSQL orientado a documentos para aplicações modernas' },
    { name: 'PostgreSQL', category: 'database', proficiency: 0.8, experience: 1.5, color: '#336791',
      description: 'Sistema de banco de dados relacional avançado com extensibilidade' },
    { name: 'Redis', category: 'database', proficiency: 0.75, experience: 1, color: '#DC382D',
      description: 'Armazenamento de estruturas de dados em memória usado como cache e mensageria' },
    { name: 'Prisma', category: 'database', proficiency: 0.85, experience: 1.5, color: '#2D3748',
      description: 'ORM next-generation para Node.js e TypeScript' },
    
    // Automação
    { name: 'RPA', category: 'automation', proficiency: 0.92, experience: 2, color: '#FF9800',
      description: 'Automação de Processos Robóticos para tarefas repetitivas' },
    { name: 'RabbitMQ', category: 'automation', proficiency: 0.85, experience: 1.5, color: '#FF6600',
      description: 'Message broker para sistemas distribuídos e microserviços' },
    { name: 'Zapier', category: 'automation', proficiency: 0.8, experience: 1, color: '#FF4A00',
      description: 'Plataforma de automação para conectar aplicativos e automatizar fluxos de trabalho' },
    { name: 'GitHub Actions', category: 'automation', proficiency: 0.85, experience: 1.5, color: '#2088FF',
      description: 'Automação de fluxos de trabalho de desenvolvimento de software' },
  ];
  
  // Filtrar tecnologias por categoria
  const filteredTech = selectedCategory === 'all' 
    ? techData 
    : techData.filter(tech => tech.category === selectedCategory);
  
  // Ajustar tamanho ao redimensionar a janela
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect();
        setWindowSize({ 
          width: width || 800, 
          height: Math.min(width, 600) // Manter proporção
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Renderizar o gráfico radar usando D3.js
  useEffect(() => {
    if (!radarRef.current || !tooltipRef.current || filteredTech.length === 0) return;
    
    // Limpar SVG
    d3.select(radarRef.current).selectAll('*').remove();
    
    // Dimensões
    const width = windowSize.width;
    const height = windowSize.height;
    const radius = Math.min(width, height) * 0.4;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Criar o SVG principal
    const svg = d3.select(radarRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Grupo principal centralizado
    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Criar círculos concêntricos
    const circleRadii = [0.2, 0.4, 0.6, 0.8, 1.0];
    circleRadii.forEach(r => {
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius * r)
        .attr('fill', 'none')
        .attr('stroke', '#1A1D27')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');
    });
    
    // Etiquetas dos círculos
    g.append('text')
      .attr('x', 0)
      .attr('y', -radius - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#E6EEF5')
      .attr('font-size', '10px')
      .text('Proficiência');
    
    g.append('text')
      .attr('x', radius + 20)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('fill', '#E6EEF5')
      .attr('font-size', '10px')
      .attr('dominant-baseline', 'middle')
      .text('Experiência');
    
    // Adicionar itens de tecnologia
    filteredTech.forEach((tech, i) => {
      // Posição angular baseada no índice
      const angle = (i / filteredTech.length) * Math.PI * 2;
      // Raio baseado na proficiência
      const r = tech.proficiency * radius;
      // Posição x,y
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      // Calcular opacidade baseada na experiência (normalizada)
      const maxExperience = Math.max(...filteredTech.map(t => t.experience));
      const opacity = 0.4 + (tech.experience / maxExperience) * 0.6;
      
      // Adicionar ponto
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8 + (tech.experience / maxExperience) * 7) // Tamanho baseado na experiência
        .attr('fill', tech.color)
        .attr('fill-opacity', opacity)
        .attr('stroke', tech.color)
        .attr('stroke-width', 1.5)
        .attr('cursor', 'pointer')
        .attr('data-tech-name', tech.name)
        .on('mouseover', (event:any) => {
          // Mostrar tooltip
          if (!tooltipRef.current) return;
          
          setSelectedTech(tech);
          
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${event.pageX + 15}px`;
          tooltipRef.current.style.top = `${event.pageY - 15}px`;
          
          // Animar ponto em destaque
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('r', 12 + (tech.experience / maxExperience) * 7)
            .attr('stroke-width', 2);
        })
        .on('mouseout', (event) => {
          // Esconder tooltip
          if (!tooltipRef.current) return;
          
          tooltipRef.current.style.opacity = '0';
          
          // Reset da animação
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('r', 8 + (tech.experience / maxExperience) * 7)
            .attr('stroke-width', 1.5);
        });
      
      // Adicionar texto
      g.append('text')
        .attr('x', Math.cos(angle) * (r + 15))
        .attr('y', Math.sin(angle) * (r + 15))
        .attr('text-anchor', Math.cos(angle) > 0.1 ? 'start' : (Math.cos(angle) < -0.1 ? 'end' : 'middle'))
        .attr('dominant-baseline', Math.sin(angle) > 0.1 ? 'hanging' : (Math.sin(angle) < -0.1 ? 'baseline' : 'middle'))
        .attr('fill', '#E6EEF5')
        .attr('font-size', '10px')
        .attr('pointer-events', 'none')
        .text(tech.name);
    });
    
    // Animação de scan circular
    const scanLine = g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -radius)
      .attr('stroke', '#00E5FF')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.7)
      .attr('stroke-linecap', 'round');
    
    // Função de animação para a linha de scan
    const rotateScanLine = () => {
      scanLine
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attrTween('transform', () => {
          return (t) => `rotate(${t * 360})`;
        })
        .on('end', rotateScanLine);
    };
    
    rotateScanLine();
    
    // Adicionar efeito de glow no centro
    const radialGradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'center-glow')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    radialGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00E5FF')
      .attr('stop-opacity', 0.3);
    
    radialGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00E5FF')
      .attr('stop-opacity', 0);
    
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius * 0.2)
      .attr('fill', 'url(#center-glow)')
      .attr('stroke', 'none');
  }, [filteredTech, windowSize]);
  
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
  
  return (
    <section id="stack" className="bg-[#0A0E17] py-24">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="h-px w-8 bg-[#00E5FF] mr-3"></span>
            <span className="text-[#00E5FF] font-mono">SYSTEM.TECH</span>
            <span className="h-px w-8 bg-[#00E5FF] ml-3"></span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6EEF5] mb-3">
            Stack <span className="text-[#00E5FF]">Técnico</span>
          </h2>
          
          <p className="text-[#7A8899] max-w-2xl mx-auto">
            Mapeamento visual de competências e tecnologias
          </p>
        </div>
        
        {/* Filtros por categoria */}
        <div className="flex flex-wrap justify-center space-x-2 space-y-2 md:space-y-0 mb-8">
          <div className="w-full text-center mb-2 text-[#7A8899] font-mono text-sm">
            scan --category=
          </div>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-300 ${
                selectedCategory === category.id 
                  ? `bg-[${category.color}]/20 text-[${category.color}] border border-[${category.color}]/50` 
                  : 'bg-[#1A1D27]/60 text-[#7A8899] border border-transparent hover:border-[#7A8899]/30'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? `${category.color}20` : undefined,
                color: selectedCategory === category.id ? category.color : undefined,
                borderColor: selectedCategory === category.id ? `${category.color}80` : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Conteúdo principal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Gráfico Radar */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-8 bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5"
          >
            {/* Legendas */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#00E5FF] font-mono text-lg">Tech Radar</h3>
              
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-[#00E5FF] rounded-full mr-2"></span>
                  <span className="text-[#7A8899]">Proficiência (distância)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 opacity-50 bg-[#00E5FF] rounded-full mr-2"></span>
                  <span className="text-[#7A8899]">Experiência (opacidade)</span>
                </div>
              </div>
            </div>
            
            {/* Container do gráfico */}
            <div 
              ref={chartContainerRef}
              className="w-full aspect-square max-h-[600px]"
            >
              <svg ref={radarRef} className="w-full h-full"></svg>
            </div>
            
            {/* Tooltip */}
            <div 
              ref={tooltipRef}
              className="fixed bg-[#0A0E17]/95 backdrop-blur-sm border border-[#00E5FF]/30 p-3 rounded-md shadow-lg transform -translate-y-full opacity-0 transition-opacity duration-200 z-50 max-w-xs pointer-events-none"
            >
              {selectedTech && (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: selectedTech.color }}
                    ></span>
                    <span className="font-bold text-[#E6EEF5]">{selectedTech.name}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#7A8899]">Categoria: </span>
                    <span className="text-[#E6EEF5]">
                      {categories.find(c => c.id === selectedTech.category)?.name || selectedTech.category}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#7A8899]">Proficiência: </span>
                    <span className="text-[#0CFF70]">{Math.round(selectedTech.proficiency * 100)}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#7A8899]">Experiência: </span>
                    <span className="text-[#00E5FF]">{selectedTech.experience} {selectedTech.experience === 1 ? 'ano' : 'anos'}</span>
                  </div>
                  {selectedTech.description && (
                    <div className="text-xs text-[#E6EEF5] mt-1 border-t border-[#7A8899]/30 pt-1">
                      {selectedTech.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Lista de tecnologias */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-4 bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5"
          >
            <h3 className="text-[#00E5FF] font-mono text-lg mb-4">Tech Stack</h3>
            
            <div className="max-h-[550px] overflow-y-auto pr-2">
              <div className="space-y-6">
                {categories.filter(c => c.id !== 'all').map(category => {
                  const techForCategory = techData.filter(tech => tech.category === category.id);
                  
                  // Pular categoria se estiver filtrando e não for a selecionada
                  if (selectedCategory !== 'all' && selectedCategory !== category.id) return null;
                  
                  return (
                    <div key={category.id} className="pb-4 border-b border-[#00E5FF]/10 last:border-0">
                      <h4 
                        className="text-[#E6EEF5] font-semibold mb-3 flex items-center"
                        style={{ color: category.color }}
                      >
                        <span 
                          className="inline-block w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></span>
                        {category.name}
                      </h4>
                      
                      <div className="space-y-2">
                        {techForCategory.map(tech => (
                          <div 
                            key={tech.name}
                            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#0A0E17]/70 transition-colors duration-200"
                          >
                            <div className="flex items-center">
                              <span 
                                className="inline-block w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: tech.color }}
                              ></span>
                              <span className="text-[#E6EEF5]">{tech.name}</span>
                            </div>
                            <div className="text-xs text-[#7A8899]">
                              {Math.round(tech.proficiency * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stack;