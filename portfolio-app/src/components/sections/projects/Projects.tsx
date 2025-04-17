import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Tipos para projetos
interface ProjectTag {
  name: string;
  color: string;
}

interface ProjectMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  year: string;
  tags: ProjectTag[];
  metrics: ProjectMetric[];
  codePreview?: string;
  demoLink?: string;
  githubLink?: string;
  expanded?: boolean;
}

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Lista de categorias para o filtro
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'backend', name: 'Backend' },
    { id: 'automacao', name: 'Automação' },
    { id: 'integracao', name: 'Integração' },
    { id: 'frontend', name: 'Frontend' }
  ];

  // Dados de projetos
  const projects: Project[] = [
    {
      id: 'p1',
      title: 'Sistema de Automação de NF-e',
      description: 'Sistema backend para emissão automatizada de notas fiscais eletrônicas, com integração direta à SEFAZ e geração de relatórios de conformidade fiscal.',
      thumbnail: '/images/projects/nfe-automation.jpg', // Placeholder, será substituído por imagem real
      category: 'automacao',
      year: '2024',
      tags: [
        { name: 'Node.js', color: '#43853D' },
        { name: 'RabbitMQ', color: '#FF6600' },
        { name: 'MongoDB', color: '#47A248' }
      ],
      metrics: [
        { label: 'Redução de tempo', value: '80%', icon: 'clock', color: '#00E5FF' },
        { label: 'Documentos processados', value: '5k+/mês', icon: 'document', color: '#0CFF70' },
        { label: 'Compliance', value: '99.8%', icon: 'check', color: '#BD00FF' }
      ],
      codePreview: `// Exemplo de código de automação
const processNfe = async (document) => {
  try {
    // Validação do documento
    const validationResult = await validateDocument(document);
    
    if (validationResult.isValid) {
      // Envia para fila de processamento
      await nfeQueue.add({
        document,
        priority: document.urgent ? 'high' : 'normal',
        timestamp: new Date()
      });
      
      logger.info(\`NFe \${document.id} enviada para processamento\`);
      await metrics.increment('nfe.queued');
      
      return { success: true, id: document.id };
    } else {
      logger.warn(\`NFe \${document.id} inválida: \${validationResult.errors.join(', ')}\`);
      return { success: false, errors: validationResult.errors };
    }
  } catch (error) {
    logger.error(\`Erro ao processar NFe \${document.id}: \${error.message}\`);
    await alertSystem.notify('nfe-processing-error', { documentId: document.id });
    throw new ServiceError('NFE_PROCESSING_FAILED', error);
  }
};`
    },
    {
      id: 'p2',
      title: 'API de Cálculo de Fretes',
      description: 'Microsserviço RESTful para cálculo de fretes em tempo real, considerando múltiplas transportadoras, condições climáticas e congestionamento de rotas.',
      thumbnail: '/images/projects/freight-api.jpg', // Placeholder
      category: 'backend',
      year: '2024',
      tags: [
        { name: 'NestJS', color: '#E0234E' },
        { name: 'PostgreSQL', color: '#336791' },
        { name: 'Docker', color: '#2496ED' }
      ],
      metrics: [
        { label: 'Tempo de resposta', value: '< 50ms', icon: 'bolt', color: '#00E5FF' },
        { label: 'Precisão', value: '97.5%', icon: 'target', color: '#0CFF70' },
        { label: 'Disponibilidade', value: '99.99%', icon: 'cloud', color: '#BD00FF' }
      ],
      codePreview: `// Exemplo de código da API de fretes
@Controller('freight')
export class FreightController {
  constructor(private readonly freightService: FreightService) {}

  @Post('/calculate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Calcula o valor do frete em tempo real' })
  async calculateFreight(@Body() freightDto: FreightCalculationDto) {
    try {
      // Adiciona telemetria para monitoramento
      this.telemetry.startSpan('freight.calculation');
      
      const result = await this.freightService.calculateOptimalRoute({
        origin: freightDto.origin,
        destination: freightDto.destination,
        weight: freightDto.weight,
        volume: freightDto.volume,
        urgency: freightDto.urgency || 'normal',
        carriers: freightDto.preferredCarriers
      });
      
      this.telemetry.endSpan();
      return result;
    } catch (error) {
      this.logger.error(\`Erro no cálculo de frete: \${error.message}\`);
      throw new ServiceException('FREIGHT_CALCULATION_ERROR', error);
    }
  }
}`
    },
    {
      id: 'p3',
      title: 'Dashboard de BI Logístico',
      description: 'Dashboard interativo para visualização de métricas de eficiência logística, com análises preditivas de demanda e alertas de gargalos operacionais.',
      thumbnail: '/images/projects/logistics-dashboard.jpg', // Placeholder
      category: 'frontend',
      year: '2023',
      tags: [
        { name: 'Angular', color: '#DD0031' },
        { name: 'D3.js', color: '#F9A03C' },
        { name: 'RxJS', color: '#B7178C' }
      ],
      metrics: [
        { label: 'Eficiência logística', value: '+25%', icon: 'chart', color: '#00E5FF' },
        { label: 'Redução de atrasos', value: '32%', icon: 'truck', color: '#0CFF70' },
        { label: 'Precisão preditiva', value: '89%', icon: 'graph', color: '#BD00FF' }
      ]
    },
    {
      id: 'p4',
      title: 'Integrador de APIs de Comunicação',
      description: 'Sistema de integração entre múltiplas plataformas de comunicação (WhatsApp, E-mail, SMS) para automação de disparos com templating e segmentação avançada.',
      thumbnail: '/images/projects/communication-api.jpg', // Placeholder
      category: 'integracao',
      year: '2024',
      tags: [
        { name: 'Node.js', color: '#43853D' },
        { name: 'Redis', color: '#DC382D' },
        { name: 'RabbitMQ', color: '#FF6600' }
      ],
      metrics: [
        { label: 'Tempo recuperado', value: '20h/mês', icon: 'clock', color: '#00E5FF' },
        { label: 'Taxa de entrega', value: '99.2%', icon: 'mail', color: '#0CFF70' },
        { label: 'Escalabilidade', value: '50k msg/min', icon: 'scale', color: '#BD00FF' }
      ]
    },
    {
      id: 'p5',
      title: 'Cluster Kubernetes para Microsserviços',
      description: 'Arquitetura cloud-native para microsserviços com orquestração Kubernetes, auto-scaling baseado em métricas de negócio e observabilidade integrada.',
      thumbnail: '/images/projects/kubernetes-cluster.jpg', // Placeholder
      category: 'backend',
      year: '2024',
      tags: [
        { name: 'Kubernetes', color: '#326CE5' },
        { name: 'Terraform', color: '#7B42BC' },
        { name: 'Prometheus', color: '#E6522C' }
      ],
      metrics: [
        { label: 'Redução de custos', value: '15%', icon: 'dollar', color: '#00E5FF' },
        { label: 'Tempo de deploy', value: '< 3min', icon: 'rocket', color: '#0CFF70' },
        { label: 'Uptime', value: '99.995%', icon: 'heart', color: '#BD00FF' }
      ]
    },
    {
      id: 'p6',
      title: 'Automação de SEO & Tráfego',
      description: 'Sistema de otimização contínua para SEO com implementação automática de melhores práticas e análise de performance.',
      thumbnail: '/images/projects/seo-automation.jpg', // Placeholder
      category: 'automacao',
      year: '2023',
      tags: [
        { name: 'React', color: '#61DAFB' },
        { name: 'Node.js', color: '#43853D' },
        { name: 'Python', color: '#3776AB' }
      ],
      metrics: [
        { label: 'Aumento de tráfego', value: '+15%', icon: 'users', color: '#00E5FF' },
        { label: 'Posições SERP', value: '+6.3', icon: 'search', color: '#0CFF70' },
        { label: 'Bugs reduzidos', value: '40%', icon: 'bug', color: '#BD00FF' }
      ]
    }
  ];
  
  // Filtrar projetos pela categoria selecionada
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);
  
  // Organizar projetos por ano (para timeline)
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = [];
    }
    acc[project.year].push(project);
    return acc;
  }, {} as Record<string, Project[]>);
  
  const years = Object.keys(projectsByYear).sort((a, b) => Number(b) - Number(a));

  // Efeito para animações de scroll com GSAP
  useEffect(() => {
    if (timelineRef.current) {
      gsap.fromTo(
        timelineRef.current.querySelectorAll('.timeline-year'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);

  // Expandir/contrair detalhes do projeto
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };
  
  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 30px -15px rgba(0, 229, 255, 0.25)",
      transition: { duration: 0.3 }
    }
  };
  
  const expandedVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <section id="projects" className="bg-[#0A0E17] py-24">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="h-px w-8 bg-[#00E5FF] mr-3"></span>
            <span className="text-[#00E5FF] font-mono">SYSTEM.MODULES</span>
            <span className="h-px w-8 bg-[#00E5FF] ml-3"></span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6EEF5] mb-3">
            <span className="text-[#00E5FF]">Projetos</span> Destacados
          </h2>
          
          <p className="text-[#7A8899] max-w-2xl mx-auto">
            Módulos de sistema implementados para solucionar desafios técnicos e de negócio
          </p>
        </div>
        
        {/* Timeline horizontal */}
        <div
          ref={timelineRef}
          className="timeline-container overflow-x-auto mb-12 pb-4"
        >
          <div className="flex space-x-6 min-w-max px-2">
            {years.map(year => (
              <div key={year} className="timeline-year">
                <div className="font-mono text-lg text-[#00E5FF] mb-2">{year}</div>
                <div className="flex flex-col space-y-3">
                  {projectsByYear[year].map(project => (
                    <div
                      key={project.id}
                      className="timeline-project px-4 py-2 bg-[#1A1D27]/60 rounded border-l-2 border-[#00E5FF] cursor-pointer hover:bg-[#1A1D27] transition-all duration-300"
                      onClick={() => {
                        setSelectedCategory(project.category);
                        
                        // Scroll para o projeto após um breve delay
                        setTimeout(() => {
                          const projectElement = document.getElementById(`project-${project.id}`);
                          if (projectElement) {
                            projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // Flash de highlight
                            projectElement.classList.add('highlight-project');
                            setTimeout(() => {
                              projectElement.classList.remove('highlight-project');
                            }, 1500);
                          }
                        }, 300);
                      }}
                    >
                      <div className="text-[#E6EEF5] font-medium">{project.title}</div>
                      <div className="text-xs text-[#7A8899]">
                        {categories.find(c => c.id === project.category)?.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filtros de categoria */}
        <div className="flex flex-wrap justify-center space-x-2 space-y-2 md:space-y-0 mb-12">
          <div className="w-full text-center mb-2 text-[#7A8899] font-mono text-sm">
            filter --category=
          </div>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50' 
                  : 'bg-[#1A1D27]/60 text-[#7A8899] border border-transparent hover:border-[#7A8899]/30'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Grid de projetos */}
        <motion.div
          ref={projectsRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map(project => (
            <motion.div
              id={`project-${project.id}`}
              key={project.id}
              variants={cardVariants}
              whileHover="hover"
              className="project-card bg-[#1A1D27] border border-[#00E5FF]/10 rounded-lg overflow-hidden transition-all duration-500"
            >
              {/* Thumbnail */}
              <div 
                className="h-48 bg-[#0A0E17] relative overflow-hidden"
                onClick={() => toggleProjectExpanded(project.id)}
              >
                {/* Placeholder thumbnail com efeito de código */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[#00E5FF] font-mono text-sm opacity-30">
                    <div>{`// ${project.title}`}</div>
                    <div>{`module.exports = async () => {`}</div>
                    <div>{`  // Implementação...`}</div>
                    <div>{`};`}</div>
                  </div>
                </div>
                
                {/* Overlay com categoria */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-[#1A1D27]/80 backdrop-blur-sm rounded-full text-xs font-mono text-[#00E5FF]">
                    {categories.find(c => c.id === project.category)?.name}
                  </span>
                </div>
                
                {/* Indicador de clique */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-1 bg-[#1A1D27]/80 backdrop-blur-sm rounded-full text-xs font-mono text-[#7A8899] flex items-center">
                    <span className="w-2 h-2 bg-[#0CFF70] rounded-full mr-1"></span>
                    click para expandir
                  </span>
                </div>
              </div>
              
              {/* Metadados do projeto */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#E6EEF5] mb-2">{project.title}</h3>
                
                <p className="text-[#7A8899] text-sm mb-4">{project.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-[#0A0E17]/80 rounded text-xs"
                      style={{ color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                
                {/* Métricas */}
                <div className="grid grid-cols-3 gap-2">
                  {project.metrics.map((metric, idx) => (
                    <div 
                      key={idx} 
                      className="flex flex-col items-center justify-center p-2 rounded bg-[#0A0E17]/50"
                    >
                      <div className="text-lg font-bold" style={{color: metric.color}}>
                        {metric.value}
                      </div>
                      <div className="text-[#7A8899] text-xs text-center">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Botão para expandir/contrair */}
                <button
                  onClick={() => toggleProjectExpanded(project.id)}
                  className="w-full mt-4 py-2 rounded bg-[#1A1D27] border border-[#00E5FF]/20 text-[#00E5FF] text-sm font-mono hover:bg-[#00E5FF]/10 transition-all duration-300 flex items-center justify-center"
                >
                  {expandedProject === project.id ? (
                    <>
                      <span className="mr-1">Fechar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    </>
                  ) : (
                    <>
                      <span className="mr-1">Ver Detalhes</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              {/* Conteúdo expandido */}
              <AnimatePresence>
                {expandedProject === project.id && project.codePreview && (
                  <motion.div
                    variants={expandedVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-5 pb-5"
                  >
                    <div className="border-t border-[#00E5FF]/10 pt-4 mb-4">
                      <div className="text-[#7A8899] font-mono text-xs mb-2">// Exemplo de código</div>
                      <div className="bg-[#0A0E17] rounded-md p-4 overflow-x-auto">
                        <pre className="text-[#E6EEF5] text-xs">
                          <code>{project.codePreview}</code>
                        </pre>
                      </div>
                    </div>
                    
                    {/* Links */}
                    <div className="flex justify-between">
                      {project.demoLink && (
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                           className="px-4 py-2 bg-[#00E5FF] text-[#0A0E17] rounded text-sm font-medium hover:bg-[#00E5FF]/90 transition-all duration-300"
                        >
                          Ver Demo
                        </a>
                      )}
                      
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                           className="px-4 py-2 bg-[#1A1D27] border border-[#00E5FF]/30 text-[#00E5FF] rounded text-sm font-medium hover:bg-[#00E5FF]/10 transition-all duration-300"
                        >
                          Ver Código
                        </a>
                      )}
                      
                      {/* Se não houver links disponíveis */}
                      {!project.demoLink && !project.githubLink && (
                        <span className="px-4 py-2 bg-[#1A1D27]/50 text-[#7A8899] rounded text-sm font-medium">
                          Código privado
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mensagem se não houver projetos */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#7A8899] font-mono">
              [NotFoundError]: No projects found in category '{selectedCategory}'
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-6 py-2 bg-[#1A1D27] border border-[#00E5FF]/20 text-[#00E5FF] rounded-md hover:bg-[#00E5FF]/10 transition-all duration-300"
            >
              Mostrar Todos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;