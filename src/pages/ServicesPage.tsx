import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Mic, 
  MessageSquare, 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  TrendingUp,
  Lock,
  FileCode,
  Check,
  Star,
  Clock,
  Cpu,
  Award,
  ChevronDown,
  ChevronUp,
  Database,
  PhoneCall,
  BadgeCheck,
  ArrowUpRight
} from 'lucide-react';
import { ServiceItem, DemoItem } from '../types';

interface ServicesPageProps {
  services: ServiceItem[];
  demos: DemoItem[];
  initialServiceSlug?: string;
  onSelectService: (serviceName: string) => void;
  onWatchDemo: (demo: DemoItem) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  demos,
  initialServiceSlug,
  onSelectService,
  onWatchDemo
}) => {
  const [activeSlug, setActiveSlug] = useState<string>(
    initialServiceSlug || (services.length > 0 ? services[0].slug : 'ai-agents')
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (initialServiceSlug) {
      setActiveSlug(initialServiceSlug);
    }
  }, [initialServiceSlug]);

  const currentService = services.find(s => s.slug === activeSlug) || services[0];

  // Find demo corresponding to active service
  const matchedDemo = demos.find(d => {
    if (!currentService) return false;
    const cat = d.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    const srv = currentService.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cat.includes(srv) || srv.includes(cat);
  }) || demos[0];

  const renderServiceIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Mic': return <Mic className={`${className} text-cyan-400`} />;
      case 'MessageSquare': return <MessageSquare className={`${className} text-blue-400`} />;
      case 'Zap': return <Zap className={`${className} text-amber-400`} />;
      case 'Smartphone': return <Smartphone className={`${className} text-emerald-400`} />;
      default: return <Bot className={`${className} text-blue-400`} />;
    }
  };

  // Service-specific technical blueprints and architectural pipelines
  const serviceArchitectures: Record<string, {
    pipeline: string[];
    telemetry: { label: string; value: string }[];
    caseStudy: {
      client: string;
      location: string;
      metric: string;
      quote: string;
    };
    faqs: { q: string; a: string }[];
  }> = {
    'ai-voice-agents': {
      pipeline: [
        'Twilio SIP / WebSockets Ingress (< 100ms)',
        'Deepgram Nova-2 Streaming Speech-to-Text (< 280ms)',
        'Low-Latency Claude 3.5 / GPT-4o Reasoning Core',
        'ElevenLabs / Cartesia High-Fidelity Voice Synthesis (< 350ms)',
        'Automated CRM / Calendar Booking Webhook Confirmation'
      ],
      telemetry: [
        { label: 'Voice Turnaround Latency', value: '< 880ms' },
        { label: 'Telephony Uptime SLA', value: '99.98%' },
        { label: 'Interruption Handling', value: 'Real-Time ASR Cutoff' },
        { label: 'VoIP Integration', value: 'Twilio / SIP / Plivo' }
      ],
      caseStudy: {
        client: 'Healthcare & Aesthetic Network',
        location: 'Dubai, UAE',
        metric: '+38% Booking Recapture',
        quote: 'Ahsan AI Labs engineered an automated telephony receptionist that handles 85+ calls every evening, resolving after-hours patient queries and booking consultations directly into Google Calendar.'
      },
      faqs: [
        {
          q: 'Can the AI voice agent transfer difficult calls to live human operators?',
          a: 'Yes, seamlessly. We configure conditional warm and cold call transfers via SIP trunking or Twilio Dial. If a patient or client requests human assistance or is flagged as high-priority, the system bridges the call to your team instantly with full context notes.'
        },
        {
          q: 'How does it handle loud ambient background noise or heavy accents?',
          a: 'We leverage state-of-the-art acoustic models (Deepgram Nova-2) paired with custom domain-specific vocabulary and phonetic dictionaries to accurately transcribe diverse international accents with over 96.5% word-accuracy rate.'
        }
      ]
    },
    'whatsapp-automation': {
      pipeline: [
        'Meta WhatsApp Cloud API Verified Webhook Receiver',
        'Customer Verification & Conversation State Management',
        'Vector Semantic Search on Company Knowledge Base',
        'Structured Function Calling (Catalog, Invoices, Booking)',
        'Sub-2-Second Automated Multi-Language Reply Delivery'
      ],
      telemetry: [
        { label: 'Average Response Time', value: '< 1.8s' },
        { label: 'Meta API Tier', value: 'Official Cloud API' },
        { label: 'Languages Supported', value: '50+ Global Languages' },
        { label: 'CRM Sync', value: 'HubSpot / Salesforce / Sheets' }
      ],
      caseStudy: {
        client: 'Omnichannel Fashion & Retail Brand',
        location: 'London, United Kingdom',
        metric: '99.2% Instant Response Rate',
        quote: 'Customer response lag reduced from 4 hours to 2.2 seconds. The WhatsApp agent handles sizing recommendations, stock checks, and abandoned cart recovery without human intervention.'
      },
      faqs: [
        {
          q: 'Will this use our official Meta WhatsApp Business number without risking bans?',
          a: 'Absolutely. We build strictly on the official Meta WhatsApp Cloud API via approved Business Solution Provider (BSP) infrastructure, ensuring full Meta policy compliance and verified green badge eligibility.'
        },
        {
          q: 'Can the bot send catalog images, PDF invoices, and interactive buttons?',
          a: 'Yes. The system supports full rich-media messaging including interactive buttons, list messages, location pickers, dynamic PDF invoices, and product catalog carousels.'
        }
      ]
    },
    'ai-agents': {
      pipeline: [
        'Task Ingestion & Multi-Step Planning (ReAct Architecture)',
        'Secure Database Retrieval via Semantic Embeddings',
        'Dynamic API & Third-Party Tool Execution',
        'Self-Reflection & Output Verification Loop',
        'Structured Notification & ERP Ingestion'
      ],
      telemetry: [
        { label: 'Execution Accuracy', value: '99.8%' },
        { label: 'Workflow Autonomy', value: 'Fully Autonomous' },
        { label: 'Security Boundary', value: 'Role-Based Isolated' },
        { label: 'Human-in-the-Loop', value: 'Configurable Approvals' }
      ],
      caseStudy: {
        client: 'Enterprise Logistics & Freight Operator',
        location: 'Dallas, TX, USA',
        metric: '140+ Hours Saved / Month',
        quote: 'The autonomous AI agent audits freight invoices, extracts bill-of-lading line items, cross-checks rate tables, and flags pricing discrepancies before payments are disbursed.'
      },
      faqs: [
        {
          q: 'How do you prevent hallucinations or unauthorized system actions?',
          a: 'We implement strict guardrails, PII sanitization, schema validation, and configurable human-in-the-loop confirmation thresholds for critical database writes or financial transactions.'
        },
        {
          q: 'Can the agent integrate with our proprietary internal database?',
          a: 'Yes. We build custom API connectors for PostgreSQL, MySQL, Supabase, MongoDB, or private internal REST APIs with zero exposure of your raw database credentials.'
        }
      ]
    },
    'business-automation': {
      pipeline: [
        'Event Ingestion via Multi-App Webhooks & Pollers',
        'Payload Transformation & Data Normalization',
        'Conditional Routing & Multi-Branch Business Logic',
        'Guaranteed Delivery with Exponential Backoff Retries',
        'Real-Time Audit Logging & Discord/Slack Error Alerts'
      ],
      telemetry: [
        { label: 'Pipeline Throughput', value: '10,000+ Tasks/Day' },
        { label: 'Error Rate', value: '< 0.01%' },
        { label: 'Retry Resilience', value: 'Exponential Backoff' },
        { label: 'Stack', value: 'Node.js / Python / n8n' }
      ],
      caseStudy: {
        client: 'B2B Professional Services Firm',
        location: 'Toronto, Canada',
        metric: '0 Duplicate Data Records',
        quote: 'Our client onboarding workflow from contract signing to project creation and Slack team setup is now 100% autonomous. Turnaround went from 2 days to 30 seconds.'
      },
      faqs: [
        {
          q: 'What happens if an external API like HubSpot or Google goes down temporarily?',
          a: 'Our pipelines are built with durable message queues and automated retries using exponential backoff. If an API is unavailable, the pipeline safely buffers events until the target recovers.'
        },
        {
          q: 'Do you provide self-hosted solutions or cloud-hosted automations?',
          a: 'We support both. We can deploy directly into your private AWS/GCP/DigitalOcean infrastructure or provide managed setups with zero vendor lock-in.'
        }
      ]
    },
    'ai-chatbots': {
      pipeline: [
        'Multi-Channel Ingestion (Web, Telegram, App SDK)',
        'Real-Time RAG Retrieval from Enterprise Documents',
        'Prompt Injection Defense & PII Redaction Filter',
        'Context-Aware Multilingual Response Generation',
        'Ticket Creation & Live Human Agent Handoff'
      ],
      telemetry: [
        { label: 'Query Resolution Rate', value: '78% Autonomous' },
        { label: 'First Response Time', value: '< 1.2s' },
        { label: 'Knowledge Base Grounding', value: 'Strict Zero-Hallucination' },
        { label: 'Supported Formats', value: 'PDF / Notion / DB / URLs' }
      ],
      caseStudy: {
        client: 'SaaS Customer Support Platform',
        location: 'Melbourne, Australia',
        metric: '78% Ticket Deflection',
        quote: 'Support backlog cleared within 48 hours of deployment. The chatbot answers complex technical billing and integration queries accurately with citations.'
      },
      faqs: [
        {
          q: 'Can the chatbot cite the exact source document or help article?',
          a: 'Yes. We utilize precise Retrieval-Augmented Generation (RAG) that attaches verifiable source links and document excerpts to answers so clients can verify accuracy.'
        },
        {
          q: 'Can we update the chatbot’s knowledge base as our policies change?',
          a: 'Yes, an intuitive administrative sync dashboard allows you to upload new PDFs, documentation URLs, or FAQ spreadsheets anytime with instant indexing.'
        }
      ]
    }
  };

  const activeArch = serviceArchitectures[activeSlug] || serviceArchitectures['ai-agents'];

  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      
      {/* 1. HEADER WITH HIGH-TRUST ARCHITECTURAL BADGING */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-cyan-950/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono uppercase tracking-wider text-[11px]">
            ENTERPRISE PRODUCTION SPECIFICATIONS • 100% CODE & IP OWNERSHIP
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
          PRODUCTION-GRADE AI SYSTEMS & ARCHITECTURES
        </h1>
        
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Explore our five specialized engineering pillars. Every system is built on dedicated low-latency infrastructure, tailored to your proprietary company data, and delivered with complete source code ownership.
        </p>

        {/* 4 Trust Signals Header Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>100% Source Code Transfer</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enterprise Mutual NDA</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Zero Public Data Training</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>30-Day Hypercare Warranty</span>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE STICKY SERVICE SELECTOR BAR */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[#060c18]/95 backdrop-blur-xl p-1.5 sm:p-2.5 rounded-2xl border border-cyan-500/30 shadow-2xl overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start lg:justify-center min-w-max space-x-2">
          {services.map((srv) => {
            const isActive = srv.slug === activeSlug;
            return (
              <button
                key={srv.slug}
                onClick={() => setActiveSlug(srv.slug)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
                }`}
              >
                {renderServiceIcon(srv.iconName, 'w-4 h-4')}
                <span className="tracking-wide">{srv.name}</span>
                {srv.badge && (
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                    isActive ? 'bg-blue-950/80 text-cyan-200 border border-cyan-400/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {srv.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE SERVICE MAIN DETAIL PRESENTATION */}
      {currentService && (
        <div className="space-y-10 sm:space-y-14 animate-in fade-in duration-300">
          
          {/* Main Hero Card for Active Service */}
          <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#071120] to-[#040914] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-950 to-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-950/50">
                    {renderServiceIcon(currentService.iconName, 'w-7 h-7')}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                      {currentService.name}
                    </h2>
                    <div className="text-xs sm:text-sm text-cyan-400 font-medium font-mono mt-0.5">
                      {currentService.tagline}
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
                  {currentService.fullDescription}
                </p>

                {/* Direct Action CTAs */}
                <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => onSelectService(currentService.name)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-cyan-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <span>{currentService.ctaText || `Order ${currentService.name}`}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  <a
                    href={`https://wa.me/923316041183?text=Hello%20Ahsan%20AI%20Labs%2C%20I%20am%20interested%20in%20deploying%20${encodeURIComponent(currentService.name)}%20for%20my%20business.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <Smartphone className="w-4 h-4 mr-2 text-emerald-400" />
                    <span>WhatsApp Architecture Inquiry</span>
                  </a>

                  {matchedDemo && (
                    <button
                      onClick={() => onWatchDemo(matchedDemo)}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700/80 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 mr-2 text-cyan-400 fill-current" />
                      <span>Watch System Video</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick SLA & Telemetry Card */}
              <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/25 space-y-4 shadow-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="flex items-center text-cyan-300 font-mono">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-cyan-400" />
                    LIVE TELEMETRY SLA
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">VERIFIED</span>
                </div>
                
                <div className="space-y-2.5 text-xs text-slate-300">
                  {activeArch.telemetry.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/80 last:border-b-0">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-white font-mono">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-1 border-t border-slate-800 pt-2">
                    <span className="text-slate-400">Code Transfer</span>
                    <span className="font-semibold text-emerald-400 font-mono">100% Client IP</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Post-Launch SLA</span>
                    <span className="font-semibold text-cyan-400 font-mono">30-Day Hypercare</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 4. TECHNICAL ARCHITECTURE PIPELINE & HANDOVER DELIVERABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Architecture Pipeline Left */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 text-left">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>UNDER THE HOOD</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  Technical Execution Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  How requests flow through our enterprise architecture in sub-second latency:
                </p>
              </div>

              <div className="space-y-3">
                {activeArch.pipeline.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center space-x-3 text-xs sm:text-sm text-slate-200 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-950 border border-cyan-500/40 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold text-cyan-300">
                      0{idx + 1}
                    </div>
                    <span className="font-medium font-mono text-xs text-slate-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Handover Package Deliverables Right */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 text-left flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <span>HANDOVER PACKAGE</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  What You Receive on Delivery
                </h3>
                <p className="text-xs text-slate-400">
                  Full ownership transfer with zero recurring agency software rent:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Private GitHub Source Repository', desc: 'Full TypeScript/Python code, Dockerfiles, and CI/CD pipelines.' },
                  { title: 'Database Schemas & Prompt Configurations', desc: 'Complete system prompts, migration scripts, and Supabase schemas.' },
                  { title: 'Self-Hosted Monitoring & Telemetry', desc: 'Real-time webhook health counters, latency metrics, and error logs.' },
                  { title: '30-Day Production Hypercare Warranty', desc: 'Active engineering oversight, bug fixes, and prompt tuning included.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-bold text-white">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-5">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 text-[11px] text-cyan-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Protected under an upfront mutual Non-Disclosure Agreement (NDA).</span>
              </div>
            </div>

          </div>

          {/* 5. FEATURES & ADVANCED CAPABILITIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Features Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 sm:space-y-6 text-left">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  CORE SPECIFICATIONS
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  Included Features & Integrations
                </h3>
              </div>

              <div className="space-y-3">
                {currentService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-blue-900/50 border border-blue-600/40 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Capabilities Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 sm:space-y-6 text-left">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  ADVANCED CAPABILITIES
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  Enterprise Resilience & Safeguards
                </h3>
              </div>

              <div className="space-y-3">
                {currentService.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-cyan-950/60 border border-cyan-700/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 6. VERIFIED SERVICE CASE STUDY SPOTLIGHT */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-cyan-950/70 border border-cyan-500/30 text-left space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>VERIFIED PRODUCTION CASE STUDY</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                <span>{activeArch.caseStudy.metric}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
              "{activeArch.caseStudy.quote}"
            </p>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-xs font-bold text-white">{activeArch.caseStudy.client}</div>
                <div className="text-[11px] text-slate-400">{activeArch.caseStudy.location}</div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* 7. REAL-WORLD USE CASES */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 sm:space-y-6 text-left">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                APPLICATION SCENARIOS
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Proven Enterprise Use Cases
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {currentService.useCases.map((uc, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    Scenario 0{idx + 1}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold font-heading text-white">
                    {uc.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. 5-STAGE MILESTONE-BASED DELIVERY PROCESS */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 text-left space-y-6">
            <div className="space-y-1 text-center max-w-2xl mx-auto">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                RISK-FREE MILESTONE DELIVERY
              </div>
              <h3 className="text-xl sm:text-3xl font-bold font-heading text-white">
                How We Deliver {currentService.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Predictable execution with zero hourly billing traps or scope creep:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                { phase: 'Phase 01', title: 'NDA & Discovery', time: 'Days 1 - 2', desc: 'Workflow audit, API security clearance, and ROI target definition under mutual NDA.' },
                { phase: 'Phase 02', title: 'Architecture Blueprint', time: 'Days 3 - 5', desc: 'Data schema design, prompt guidelines, and locked milestone pricing sign-off.' },
                { phase: 'Phase 03', title: 'System Engineering', time: 'Days 6 - 12', desc: 'Full-stack development of models, voice pipelines, and webhook handlers.' },
                { phase: 'Phase 04', title: 'Hardening & Stress Testing', time: 'Days 13 - 15', desc: 'Edge-case handling, prompt injection audits, and telephony load testing.' },
                { phase: 'Phase 05', title: 'Code Handover & SLA', time: 'Day 16+', desc: '100% GitHub code transfer, staff training, and 30-day warranty activation.' }
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold text-cyan-400">{m.phase}</div>
                    <div className="text-xs font-bold text-white">{m.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</div>
                  </div>
                  <div className="pt-2 text-[10px] font-mono font-semibold text-emerald-400 border-t border-slate-800">
                    {m.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. SERVICE-SPECIFIC TRUST & TECHNICAL FAQS */}
          <div className="space-y-4 max-w-4xl mx-auto text-left">
            <div className="text-center space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                TECHNICAL QUESTIONS
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Frequently Asked About {currentService.name}
              </h3>
            </div>

            <div className="space-y-2.5 pt-2">
              {activeArch.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all text-left"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-3.5 sm:py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {faq.q}
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 text-slate-400">
                        {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10. BUSINESS BENEFITS & ORDER ACTION BOTTOM BAR */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-cyan-950/70 border border-cyan-500/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                Measurable Business Return
              </div>
              <div className="space-y-1">
                {currentService.benefits.map((b, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-slate-200 flex items-center space-x-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectService(currentService.name)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <span>{currentService.ctaText || `Order ${currentService.name}`}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <a
                href={`https://wa.me/923316041183?text=Hello%20Ahsan%20AI%20Labs%2C%20I%20would%20like%20to%20consult%20regarding%20${encodeURIComponent(currentService.name)}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Smartphone className="w-4 h-4 mr-2 text-emerald-400" />
                <span>WhatsApp Architect</span>
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
