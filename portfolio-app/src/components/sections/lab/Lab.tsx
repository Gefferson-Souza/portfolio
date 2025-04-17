import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Interface para as demonstrações de automação
interface AutomationDemo {
  id: string;
  title: string;
  description: string;
  before: {
    time: string;
    steps: number;
    errorRate: string;
  };
  after: {
    time: string;
    steps: number;
    errorRate: string;
  };
  animation: string; // Path para animação lottie
  codeSnippet: string;
  parameters: {
    name: string;
    min: number;
    max: number;
    default: number;
    step: number;
    unit: string;
  }[];
}

const Lab = () => {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [demoParams, setDemoParams] = useState<Record<string, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLElement>(null);
  
  // Dados das demonstrações
  const automationDemos: AutomationDemo[] = [
    {
      id: 'demo1',
      title: 'Automação de Documentos Fiscais',
      description: 'Demonstração de como a automação reduz drasticamente o tempo de emissão e aprovação de documentos fiscais, eliminando erros humanos e acelerando o processo.',
      before: {
        time: '45min',
        steps: 12,
        errorRate: '5.2%'
      },
      after: {
        time: '45seg',
        steps: 2,
        errorRate: '0.2%'
      },
      animation: '/animations/doc-automation.json', // Placeholder
      codeSnippet: `// Código de automação de documentos fiscais
import { DocumentProcessor } from './lib/document';
import { Notifier } from './lib/communication';

export class InvoiceAutomation {
  constructor(
    private readonly processor: DocumentProcessor,
    private readonly notifier: Notifier
  ) {}

  async processInvoiceBatch(invoices: Invoice[]): Promise<ProcessResult> {
    const startTime = performance.now();
    
    // 1. Validar todos os documentos em paralelo
    const validationResults = await Promise.all(
      invoices.map(invoice => this.processor.validate(invoice))
    );
    
    // 2. Filtrar apenas documentos válidos
    const validInvoices = invoices.filter(
      (_, index) => validationResults[index].isValid
    );
    
    // 3. Processar os documentos válidos em lote
    const processedIds = await this.processor.processBatch(validInvoices);
    
    // 4. Notificar os resultados
    await this.notifier.sendBatchNotification({
      successful: processedIds.length,
      failed: invoices.length - processedIds.length,
      processingTime: performance.now() - startTime
    });
    
    return {
      processed: processedIds,
      failedCount: invoices.length - processedIds.length,
      successRate: processedIds.length / invoices.length
    };
  }
}`,
      parameters: [
        {
          name: 'Quantidade de Documentos',
          min: 1,
          max: 100,
          default: 25,
          step: 1,
          unit: 'docs'
        },
        {
          name: 'Prioridade de Processamento',
          min: 1,
          max: 10,
          default: 5,
          step: 1,
          unit: 'nivel'
        }
      ]
    },
    {
      id: 'demo2',
      title: 'Integração de APIs de Comunicação',
      description: 'Visualize como um sistema integrador centraliza diferentes canais de comunicação (WhatsApp, Email, SMS) para disparos automatizados e programados.',
      before: {
        time: '20h/mês',
        steps: 18,
        errorRate: '8.7%'
      },
      after: {
        time: '0h/mês',
        steps: 1,
        errorRate: '0.8%'
      },
      animation: '/animations/api-integration.json', // Placeholder
      codeSnippet: `// Código do integrador de comunicação
import { MessageQueue } from './infrastructure/queue';
import { TemplateEngine } from './services/template';
import { ChannelManager, Channel } from './channels/manager';

export class CommunicationHub {
  constructor(
    private readonly queue: MessageQueue,
    private readonly template: TemplateEngine,
    private readonly channelManager: ChannelManager
  ) {
    this.initializeConsumers();
  }

  private initializeConsumers() {
    this.queue.consume('communication.outbound', async (message) => {
      try {
        const { template: templateId, data, channels, priority } = message;
        
        // Renderizar o template com os dados
        const content = await this.template.render(templateId, data);
        
        // Enviar para cada canal especificado
        const results = await Promise.all(
          channels.map(channel => 
            this.channelManager.send(channel as Channel, {
              content,
              priority,
              recipient: data.recipient,
              metadata: {
                campaignId: data.campaignId,
                triggeredBy: data.source
              }
            })
          )
        );
        
        // Registrar os resultados
        await this.queue.publish('communication.results', {
          original: message.id,
          results: results.map((r, i) => ({
            channel: channels[i],
            success: r.success,
            messageId: r.messageId,
            timestamp: new Date()
          }))
        });
        
      } catch (error) {
        console.error('Falha no processamento de mensagem:', error);
        // Republicar para tentativa posterior
        if (message.retries < 3) {
          await this.queue.publish('communication.outbound', {
            ...message,
            retries: (message.retries || 0) + 1,
            error: error.message
          });
        } else {
          await this.queue.publish('communication.failed', {
            original: message,
            error: error.message,
            finalAttempt: true
          });
        }
      }
    });
  }
}`,
      parameters: [
        {
          name: 'Volume de Mensagens',
          min: 100,
          max: 10000,
          default: 1000,
          step: 100,
          unit: 'msgs'
        },
        {
          name: 'Canais Integrados',
          min: 1,
          max: 5,
          default: 3,
          step: 1,
          unit: 'APIs'
        }
      ]
    },
    {
      id: 'demo3',
      title: 'Pipeline de CI/CD para Microsserviços',
      description: 'Demonstração de um pipeline completo de integração e entrega contínua para ambientes de microsserviços, com testes automatizados e deploy zero-downtime.',
      before: {
        time: '45min',
        steps: 15,
        errorRate: '12%'
      },
      after: {
        time: '3min',
        steps: 0,
        errorRate: '0.5%'
      },
      animation: '/animations/cicd-pipeline.json', // Placeholder
      codeSnippet: `// Arquivo de configuração do pipeline CI/CD
# Arquivo: .github/workflows/deploy.yml
name: Microservice CI/CD Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]
    
env:
  IMAGE_NAME: api-service
  K8S_NAMESPACE: production
  
jobs:
  test:
    name: Test and Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
        
  build:
    name: Build and Push Image
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: \${GITHUB_ACTOR}
          password: \${GITHUB_TOKEN}
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ghcr.io/\${GITHUB_REPOSITORY}/\${IMAGE_NAME}
      - name: Build and push
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: \${TAGS}
          labels: \${LABELS}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          
  deploy:
    name: Deploy to Kubernetes
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Set up Kustomize
        uses: imranismail/setup-kustomize@v1
      - name: Update Kubernetes resources
        run: |
          cd k8s/overlays/production
          kustomize edit set image ghcr.io/\${GITHUB_REPOSITORY}/\${IMAGE_NAME}=ghcr.io/\${GITHUB_REPOSITORY}/\${IMAGE_NAME}:\${GITHUB_SHA}
      - name: Deploy to cluster
        uses: azure/k8s-deploy@v1
        with:
          namespace: \${K8S_NAMESPACE}
          manifests: |
            k8s/overlays/production
          images: |
            ghcr.io/\${GITHUB_REPOSITORY}/\${IMAGE_NAME}:\${GITHUB_SHA}
          strategy: canary
          percentage: 20
          
  promote:
    name: Promote Deployment
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Check deployment health
        run: |
          # Script para verificar a saúde do deployment
          echo "Checking health of new pods..."
          sleep 60 # Aguarda estabilização
          
      - name: Promote to 100%
        uses: azure/k8s-deploy@v1
        with:
          namespace: \${K8S_NAMESPACE}
          strategy: canary
          percentage: 100
          promote: true`,
      parameters: [
        {
          name: 'Número de Microsserviços',
          min: 1,
          max: 20,
          default: 5,
          step: 1,
          unit: 'serviços'
        },
        {
          name: 'Etapas do Pipeline',
          min: 3,
          max: 8,
          default: 5,
          step: 1,
          unit: 'etapas'
        }
      ]
    }
  ];
  
  // Inicializar parâmetros das demos
  useEffect(() => {
    const initialParams: Record<string, number> = {};
    automationDemos.forEach(demo => {
      demo.parameters.forEach(param => {
        initialParams[`${demo.id}-${param.name}`] = param.default;
      });
    });
    setDemoParams(initialParams);
  }, []);
  
  // Selecionar uma demo
  useEffect(() => {
    if (!selectedDemo && automationDemos.length > 0) {
      setSelectedDemo(automationDemos[0].id);
    }
  }, [selectedDemo]);
  
  // Simulação do efeito de animação
  const triggerAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
  };
  
  // Mudar parâmetros das demos
  const handleParamChange = (demoId: string, paramName: string, value: number) => {
    setDemoParams(prev => ({
      ...prev,
      [`${demoId}-${paramName}`]: value
    }));
  };
  
  // Demo atual
  const currentDemo = automationDemos.find(demo => demo.id === selectedDemo);
  
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
      transition: { duration: 0.6 }
    }
  };
  
  // Efeito para animações GSAP
  useEffect(() => {
    if (labRef.current) {
      gsap.to(".demo-tab", {
        scrollTrigger: {
          trigger: labRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  }, []);
  
  return (
    <section id="lab" ref={labRef} className="bg-[#0A0E17] py-24">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="h-px w-8 bg-[#00E5FF] mr-3"></span>
            <span className="text-[#00E5FF] font-mono">SYSTEM.OPERATIONS</span>
            <span className="h-px w-8 bg-[#00E5FF] ml-3"></span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6EEF5] mb-3">
            <span className="text-[#00E5FF]">Lab</span> de Automação
          </h2>
          
          <p className="text-[#7A8899] max-w-2xl mx-auto">
            Centro de operações com demonstrações interativas de automação e eficiência operacional
          </p>
        </div>
        
        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Navegação lateral */}
          <div className="lg:col-span-3">
            <div className="bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-4">
              <h3 className="text-[#00E5FF] font-mono text-lg mb-4 flex items-center">
                <span className="inline-block w-2 h-2 bg-[#00E5FF] mr-2"></span>
                Demonstrações
              </h3>
              
              <div className="space-y-2">
                {automationDemos.map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => setSelectedDemo(demo.id)}
                    className={`demo-tab w-full text-left px-3 py-2 rounded flex items-center opacity-0 transform translate-y-4 ${
                      selectedDemo === demo.id
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-l-2 border-[#00E5FF]'
                        : 'hover:bg-[#0A0E17]/40 text-[#7A8899] hover:text-[#E6EEF5] border-l-2 border-transparent'
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 mr-2 rounded-full ${
                      selectedDemo === demo.id ? 'bg-[#0CFF70]' : 'bg-[#7A8899]'
                    }`}></span>
                    <span className="truncate">{demo.title}</span>
                  </button>
                ))}
              </div>
              
              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-[#00E5FF]/10">
                <div className="text-[#7A8899] font-mono text-xs mb-2">// Ganhos de automação</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E6EEF5]">Tempo recuperado</span>
                      <span className="text-[#0CFF70]">+95%</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0E17] rounded-full">
                      <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E6EEF5]">Redução de erros</span>
                      <span className="text-[#0CFF70]">+98%</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0E17] rounded-full">
                      <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] rounded-full" style={{width: '98%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E6EEF5]">Escalabilidade</span>
                      <span className="text-[#0CFF70]">+1000%</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0E17] rounded-full">
                      <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0CFF70] rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conteúdo principal */}
          <div className="lg:col-span-9">
            {currentDemo && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* Painel de informações */}
                <motion.div variants={itemVariants} className="md:col-span-12">
                  <div className="bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5">
                    <h3 className="text-xl font-bold text-[#E6EEF5] mb-2">{currentDemo.title}</h3>
                    <p className="text-[#7A8899]">{currentDemo.description}</p>
                  </div>
                </motion.div>
                
                {/* Visualização da automação */}
                <motion.div variants={itemVariants} className="md:col-span-8">
                  <div className="bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5 h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[#00E5FF] font-mono">Visualização</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#7A8899] text-xs font-mono">status:</span>
                        <span className={`text-xs font-mono ${isAnimating ? 'text-[#0CFF70]' : 'text-[#BD00FF]'}`}>
                          {isAnimating ? 'running' : 'idle'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Demo container */}
                    <div 
                      ref={animationRef}
                      className="bg-[#0A0E17] rounded-lg aspect-[16/9] flex items-center justify-center overflow-hidden relative"
                    >
                      {/* Placeholder para animação */}
                      <div className="text-center">
                        <div className="text-[#00E5FF] font-mono mb-4">
                          {isAnimating ? 'Processando automação...' : 'Clique em "Executar" para iniciar a demonstração'}
                        </div>
                        
                        {/* Animação placeholder */}
                        {isAnimating && (
                          <div className="flex justify-center space-x-4">
                            {Array.from({length: 3}).map((_, i) => (
                              <div 
                                key={i}
                                className="w-3 h-3 rounded-full bg-[#00E5FF] animate-bounce"
                                style={{ 
                                  animationDelay: `${i * 0.15}s`,
                                  animationDuration: '0.6s'
                                }}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={triggerAnimation}
                        disabled={isAnimating}
                        className={`px-4 py-2 rounded text-sm font-mono ${
                          isAnimating
                            ? 'bg-[#1A1D27] text-[#7A8899] cursor-not-allowed'
                            : 'bg-[#00E5FF] text-[#0A0E17] hover:bg-[#00E5FF]/90'
                        } transition-all duration-300`}
                      >
                        {isAnimating ? 'Executando...' : 'Executar Demo'}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-[#7A8899] text-xs">velocidade:</span>
                        <select className="bg-[#0A0E17] border border-[#00E5FF]/20 text-[#E6EEF5] text-xs rounded px-2 py-1">
                          <option value="1">1x</option>
                          <option value="2">2x</option>
                          <option value="4" selected>4x</option>
                          <option value="8">8x</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Controles */}
                <motion.div variants={itemVariants} className="md:col-span-4">
                  <div className="bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5 h-full">
                    <h4 className="text-[#00E5FF] font-mono mb-4">Parâmetros</h4>
                    
                    <div className="space-y-6">
                      {currentDemo.parameters.map(param => (
                        <div key={param.name}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#E6EEF5]">{param.name}</span>
                            <span className="text-[#0CFF70]">
                              {demoParams[`${currentDemo.id}-${param.name}`]} {param.unit}
                            </span>
                          </div>
                          
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={demoParams[`${currentDemo.id}-${param.name}`] || param.default}
                            onChange={(e) => handleParamChange(currentDemo.id, param.name, Number(e.target.value))}
                            className="w-full h-2 bg-[#0A0E17] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Comparação Antes/Depois */}
                    <div className="mt-8 pt-6 border-t border-[#00E5FF]/10">
                      <h4 className="text-[#00E5FF] font-mono mb-4">Antes / Depois</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-center text-[#7A8899] font-mono text-xs">Manual</div>
                          
                          <div className="bg-[#0A0E17]/50 p-3 rounded">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#7A8899]">Tempo:</span>
                              <span className="text-[#E6EEF5]">{currentDemo.before.time}</span>
                            </div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#7A8899]">Etapas:</span>
                              <span className="text-[#E6EEF5]">{currentDemo.before.steps}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[#7A8899]">Erro:</span>
                              <span className="text-[#E6EEF5]">{currentDemo.before.errorRate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-center text-[#0CFF70] font-mono text-xs">Automático</div>
                          
                          <div className="bg-[#0A0E17]/50 border border-[#0CFF70]/20 p-3 rounded">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#7A8899]">Tempo:</span>
                              <span className="text-[#0CFF70]">{currentDemo.after.time}</span>
                            </div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#7A8899]">Etapas:</span>
                              <span className="text-[#0CFF70]">{currentDemo.after.steps}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[#7A8899]">Erro:</span>
                              <span className="text-[#0CFF70]">{currentDemo.after.errorRate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Código de exemplo */}
                <motion.div variants={itemVariants} className="md:col-span-12">
                  <div className="bg-[#1A1D27] border border-[#00E5FF]/20 rounded-lg p-5">
                    <h4 className="text-[#00E5FF] font-mono mb-4">Código de Implementação</h4>
                    
                    <div className="bg-[#0A0E17] rounded-lg p-4 overflow-x-auto">
                      <pre className="text-[#E6EEF5] text-xs">
                        <code>{currentDemo.codeSnippet}</code>
                      </pre>
                    </div>
                    
                    <div className="mt-4 text-xs text-[#7A8899]">
                      Este é um trecho simplificado do código real utilizado na automação
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lab;