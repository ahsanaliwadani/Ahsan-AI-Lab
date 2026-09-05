import React, { useState } from 'react';
import { 
  Bot, 
  Mic, 
  MessageSquare, 
  Zap, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Play,   
  Sparkles, 
  TrendingUp, 
  Layers,    
  Lock,
  Clock,
  Cpu,
  ShieldCheck,
  Shield,
  Award,
  FileCheck2,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Sliders,
  Calculator,
  ArrowUpRight,
  Scale,
  Activity,
  Globe,
  PhoneCall
} from 'lucide-react';
import { ServiceItem, DemoItem, CompanyContent } from '../types';
import { AIVisualCanvas } from '../components/AIVisualCanvas';

interface HomePageProps {
  content?: CompanyContent;
  services: ServiceItem[];
  demos: DemoItem[];
  onNavigate: (path: string) => void;
  onSelectService: (serviceName: string) => void;
  onWatchDemo: (demo: DemoItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  content,
  services,
  demos,
  onNavigate,
  onSelectService,
  onWatchDemo
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [calcInquiries, setCalcInquiries] = useState<number>(1500);
  const [calcServiceType, setCalcServiceType] = useState<string>('AI Voice Agents');

  // Service icon helper
  const renderServiceIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Mic': return <Mic className={`${className} text-cyan-400`} />;
      case 'MessageSquare': return <MessageSquare className={`${className} text-blue-400`} />;
      case 'Zap': return <Zap className={`${className} text-amber-400`} />;
      case 'Smartphone': return <Smartphone className={`${className} text-emerald-400`} />;
      default: return <Bot className={`${className} text-blue-400`} />;
    }
  };

  const featuredDemos = demos.filter(d => d.featured).slice(0, 3);
  const displayDemos = featuredDemos.length > 0 ? featuredDemos : demos.slice(0, 3);

  // Dynamic ROI calculations for interactive client calculator
  const calculateRoi = () => {
    let multiplier = 0.12; // hours saved per inquiry/call
    let revenueFactor = 5.5; // estimated recovered revenue per interaction
    let responseDrop = 'Under 1.8 seconds';

    if (calcServiceType === 'AI Voice Agents') {
      multiplier = 0.16;
      revenueFactor = 8.2;
      responseDrop = '< 950ms voice latency';
    } else if (calcServiceType === 'WhatsApp Automation') {
      multiplier = 0.09;
      revenueFactor = 4.8;
      responseDrop = 'Instant (~1.5 seconds)';
    } else if (calcServiceType === 'AI Agents') {
      multiplier = 0.22;
      revenueFactor = 11.0;
      responseDrop = 'Sub-second autonomous execution';
    } else if (calcServiceType === 'Business Automation') {
      multiplier = 0.28;
      revenueFactor = 14.5;
      responseDrop = 'Zero human delay pipeline';
    }

    const hoursSaved = Math.round(calcInquiries * multiplier);
    const revenueRecovered = Math.round(calcInquiries * revenueFactor);

    return {
      hoursSaved,
      revenueRecovered,
      responseDrop
    };
  };

  const roiStats = calculateRoi();

  // The 4 Pillars of Trust
  const trustGuarantees = [
    {
      icon: <FileCheck2 className="w-6 h-6 text-cyan-400" />,
      title: '100% Client Code & IP Ownership',
      badge: 'Full IP Handover',
      description: 'You own everything. Complete GitHub source repositories, prompt configurations, database schemas, and integration credentials belong strictly to your company with zero vendor lock-in.'
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'Enterprise Mutual NDA & Zero Training',
      badge: 'Strict Confidentiality',
      description: 'We execute mutual Non-Disclosure Agreements upfront. Client data and proprietary workflows are never retained, exposed, or used to train public foundational AI models.'
    },
    {
      icon: <Award className="w-6 h-6 text-blue-400" />,
      title: 'Milestone-Based Fixed Transparent Pricing',
      badge: 'Zero Surprise Invoices',
      description: 'No unpredictable hourly billing traps. Every architecture sprint is bound to explicit deliverables, measurable acceptance criteria, and locked milestone phases.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: '30-Day Hypercare Warranty & Active SLA',
      badge: '30-Day SLA Included',
      description: 'Every production release is protected by 30 days of active engineering monitoring, latency tuning, edge-case hardening, and operational staff training.'
    }
  ];

  // Industry Tech Stack Ecosystem
  const techStackBadges = [
    { name: 'OpenAI Enterprise', type: 'LLM Engine', dot: 'bg-emerald-400' },
    { name: 'Claude 3.5 Sonnet', type: 'Reasoning & Code', dot: 'bg-amber-400' },
    { name: 'Google Gemini 1.5 Pro', type: 'Multimodal AI', dot: 'bg-blue-400' },
    { name: 'Meta WhatsApp Cloud API', type: 'Official Certified', dot: 'bg-emerald-400' },
    { name: 'Twilio Voice & SIP', type: 'Telephony Pipeline', dot: 'bg-red-400' },
    { name: 'ElevenLabs Voice', type: 'Human-Parity Audio', dot: 'bg-cyan-400' },
    { name: 'PostgreSQL / Supabase', type: 'Encrypted DB', dot: 'bg-blue-400' },
    { name: 'n8n & Webhooks', type: 'API Orchestration', dot: 'bg-purple-400' }
  ];

  // Verified Client Endorsements
  const clientEndorsements = [
    {
      quote: 'Ahsan AI Labs deployed an autonomous voice telephony agent that handles 85+ calls every evening, synchronizes real-time slots into Google Calendar, and recovered $18,000 in missed bookings in our first 30 days.',
      clientName: 'Dr. Tariq M.',
      role: 'Operations Director',
      company: 'Healthcare & Wellness Network',
      location: 'Dubai, UAE',
      metric: '+38% Booking Recovery',
      stars: 5
    },
    {
      quote: 'Our WhatsApp response time dropped from 4 hours down to 3 seconds. The lead qualification engine connects straight into HubSpot, saving our business development team 25+ manual hours every single week.',
      clientName: 'Sarah Jenkins',
      role: 'Head of Growth',
      company: 'Omnichannel Retail Group',
      location: 'London, United Kingdom',
      metric: '99.2% Instant Response Rate',
      stars: 5
    },
    {
      quote: 'Zero fluff, pure engineering craft. Ahsan delivered clean, fully commented TypeScript code that our in-house DevOps team adopted effortlessly. The milestone structure gave our board 100% confidence.',
      clientName: 'Marcus Vance',
      role: 'Chief Technology Officer',
      company: 'Enterprise Supply & Logistics',
      location: 'Dallas, TX, USA',
      metric: '100% Code Transfer Completed',
      stars: 5
    }
  ];

  // Homepage Trust FAQs
  const homeTrustFaqs = [
    {
      q: 'Do we own 100% of the custom codebase and intellectual property?',
      a: 'Yes, unconditionally. When your system is deployed, we transfer full source code ownership, private GitHub repositories, Docker build files, database schemas, and API documentation directly to your organization. You are never tied to proprietary agency subscriptions.'
    },
    {
      q: 'Do you execute an NDA before we share our company workflows?',
      a: 'Yes. Before reviewing sensitive internal databases, proprietary CRM endpoints, or operational processes, we execute a comprehensive mutual Non-Disclosure Agreement (NDA) to legally protect your trade secrets.'
    },
    {
      q: 'Is our sensitive company data used to train public AI models?',
      a: 'Never. We strictly architect using Enterprise Zero Data Retention (ZDR) APIs from OpenAI, Anthropic, Google Cloud Vertex, and AWS. Your customer data, internal logs, and conversation transcripts are never retained or fed into public training corpuses.'
    },
    {
      q: 'How do your AI voice agents achieve sub-second human conversational latency?',
      a: 'We engineer ultra-low-latency voice pipelines combining Deepgram Nova-2 streaming speech-to-text, optimized fast-reasoning LLMs, and ElevenLabs / Cartesia real-time speech synthesis over WebSockets and SIP trunking. The end-to-end voice latency is under 900ms, providing true human conversational pacing with intelligent interruption handling.'
    },
    {
      q: 'What happens if a third-party API or telephony gateway has a transient outage?',
      a: 'Every enterprise system we construct is built with multi-layered fallback resilience. If a primary model provider experiences elevated latency, requests automatically fail over to secondary models (e.g. Claude to Gemini), while telephony calls gracefully fall back to human staff routing or priority SMS callbacks with zero data loss.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-32 overflow-hidden">
      
      {/* 1. HERO SECTION WITH HIGH-TRUST ARCHITECTURAL BADGING */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        {/* Futuristic lighting background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] sm:h-[650px] bg-blue-600/15 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-0 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-cyan-400/10 rounded-full blur-[120px] sm:blur-[170px] pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

            {/* HERO LEFT CONTENT */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-7 text-left relative z-10">
              
              {/* Enterprise Live Status Badge */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-cyan-950/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-950/40 max-w-full">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="tracking-wider uppercase font-mono text-[10px] sm:text-[11px] truncate">
                  ENTERPRISE AI ARCHITECTS • 99.98% TELEPHONY & AGENT SLA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-heading text-white tracking-tight leading-[1.05]">
                BUILD A SMARTER,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_25px_rgba(0,210,255,0.25)]">
                  AUTONOMOUS BUSINESS.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                {content?.hero?.subtitle ||
                  'We engineer enterprise-grade AI agents, telephony voice assistants, intelligent chatbots, automated business pipelines, and Meta WhatsApp digital systems that empower companies to scale effortlessly.'}
              </p>

              {/* Trust Badges Checkpoint */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>100% Client Code & IP Ownership</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Enterprise Mutual NDA Included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Zero Public Training on Your Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>30-Day Post-Launch Warranty</span>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onNavigate('/get-started')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group"
                >
                  <span>Schedule Architecture Discovery</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/services')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm tracking-wide border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <span>Explore 5 Production Services</span>
                </button>
              </div>

              {/* HERO SERVICE QUICK ACCESS */}
              <div className="pt-2 sm:pt-4 grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
                <button
                  onClick={() => onSelectService('AI Agents')}
                  className="group text-left rounded-2xl border border-cyan-500/20 bg-slate-950/55 hover:bg-slate-900/80 hover:border-cyan-400/50 backdrop-blur-xl p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-cyan-950/60 border border-cyan-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bot className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">AI AGENTS</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Autonomous Workflows</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectService('AI Voice Agents')}
                  className="group text-left rounded-2xl border border-blue-500/20 bg-slate-950/55 hover:bg-slate-900/80 hover:border-blue-400/50 backdrop-blur-xl p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-950/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-blue-950/60 border border-blue-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mic className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">AI VOICE</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">&lt; 900ms Latency</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectService('AI Chatbots')}
                  className="group text-left rounded-2xl border border-sky-500/20 bg-slate-950/55 hover:bg-slate-900/80 hover:border-sky-400/50 backdrop-blur-xl p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-950/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-sky-950/60 border border-sky-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5 text-sky-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">AI CHATBOTS</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Omnichannel Support</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectService('WhatsApp Automation')}
                  className="group text-left rounded-2xl border border-emerald-500/20 bg-slate-950/55 hover:bg-slate-900/80 hover:border-emerald-400/50 backdrop-blur-xl p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-emerald-950/60 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Smartphone className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">WHATSAPP</div>
                      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">Official Cloud API</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* HERO RIGHT - AI ECOSYSTEM VISUAL */}
            <div className="lg:col-span-6 xl:col-span-6 relative min-h-[430px] sm:min-h-[500px] lg:min-h-[580px] flex items-center justify-center">
              {/* Decorative world / data field */}
              <div className="absolute inset-4 sm:inset-0 rounded-full opacity-60 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18)_0,transparent_42%)]" />
              <div className="absolute left-1/2 top-1/2 w-[82%] h-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/20 shadow-[0_0_90px_rgba(14,165,233,0.12)]" />
              <div className="absolute left-1/2 top-1/2 w-[64%] h-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20" />

              {/* Animated data orbit lines */}
              <div className="absolute left-[10%] top-[42%] w-[78%] h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rotate-[-18deg]" />
              <div className="absolute left-[10%] top-[50%] w-[78%] h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rotate-[12deg]" />
              <div className="absolute left-[20%] top-[25%] w-[58%] h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent rotate-[28deg]" />

              {/* Floating AI service cards with live telemetry */}
              <div className="absolute left-0 sm:left-2 top-[16%] z-20 rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-4 py-3 shadow-xl shadow-cyan-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">AI AGENTS</div>
                    <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">Autonomous Execution</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 sm:right-2 top-[16%] z-20 rounded-2xl border border-blue-500/30 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-4 py-3 shadow-xl shadow-blue-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">AI VOICE</div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-400 font-mono">&lt; 900ms Latency</div>
                  </div>
                </div>
              </div>

              <div className="absolute left-0 sm:left-0 top-[48%] z-20 rounded-2xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-4 py-3 shadow-xl shadow-cyan-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">AI CHATBOTS</div>
                    <div className="text-[9px] sm:text-[10px] text-blue-400 font-mono">24/7 Verified SLA</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 sm:right-0 top-[48%] z-20 rounded-2xl border border-emerald-500/30 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-4 py-3 shadow-xl shadow-emerald-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">BUSINESS ROI</div>
                    <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">Measurable Scale</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-[2%] sm:right-[4%] bottom-[13%] z-20 rounded-2xl border border-emerald-500/30 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-4 py-3 shadow-xl shadow-emerald-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">WHATSAPP</div>
                    <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono">Official Cloud API</div>
                  </div>
                </div>
              </div>

              {/* Main glowing platform */}
              <div className="absolute left-1/2 bottom-[4%] sm:bottom-[5%] -translate-x-1/2 w-[70%] sm:w-[64%] h-24 sm:h-28 z-10">
                <div className="absolute inset-x-[8%] bottom-0 h-10 rounded-[50%] border border-cyan-400/30 bg-blue-950/60 blur-[1px] shadow-[0_0_45px_rgba(6,182,212,0.35)]" />
                <div className="absolute inset-x-[13%] bottom-3 h-10 rounded-[50%] border border-cyan-400/40 bg-gradient-to-r from-blue-950 via-cyan-950 to-blue-950" />
                <div className="absolute inset-x-[20%] bottom-8 h-8 rounded-[50%] bg-cyan-400/25 blur-md" />
              </div>

              {/* Main logo / hologram */}
              <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-blue-950/50 via-slate-950/40 to-cyan-950/50 backdrop-blur-md shadow-[0_0_80px_rgba(14,165,233,0.25)] flex items-center justify-center animate-[pulse_5s_ease-in-out_infinite]">
                <div className="absolute inset-3 rounded-[1.5rem] border border-cyan-400/15" />
                <div className="absolute inset-0 rounded-[2rem] bg-cyan-400/5 blur-xl" />
                <img
                  src="/logo.png"
                  alt="Ahsan AI Labs"
                  className="relative z-10 w-[68%] h-[68%] object-contain drop-shadow-[0_0_30px_rgba(34,211,238,0.75)]"
                />
              </div>

              {/* Small glowing network nodes */}
              <span className="absolute left-[30%] top-[27%] w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,1)]" />
              <span className="absolute right-[29%] top-[34%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,1)]" />
              <span className="absolute left-[25%] bottom-[28%] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,1)]" />
              <span className="absolute right-[24%] bottom-[30%] w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,1)]" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. ENTERPRISE TECH STACK & INTEGRATION ECOSYSTEM TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>PRODUCTION-GRADE AI & TELEPHONY INFRASTRUCTURE</span>
            </div>
            <div className="text-[11px] text-cyan-400 font-mono">
              Zero Vendor Lock-in • Enterprise ZDR Compliance
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {techStackBadges.map((stack, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-center space-y-1 text-left hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stack.dot}`} />
                  <span className="text-xs font-bold text-white truncate">{stack.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{stack.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROVEN TRACK RECORD METRICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a1526]/90 to-slate-950 border border-cyan-500/25 shadow-2xl backdrop-blur-xl">
          <div className="text-center sm:text-left space-y-1 p-3 border-r border-slate-800/80 last:border-r-0">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              50<span className="text-cyan-400">+</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">Production Systems Shipped</div>
            <div className="text-[11px] text-slate-400">Deployed across US, UK, UAE & Global Markets</div>
          </div>

          <div className="text-center sm:text-left space-y-1 p-3 border-r border-slate-800/80 last:border-r-0">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              1.2M<span className="text-cyan-400">+</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">Conversations & Calls Handled</div>
            <div className="text-[11px] text-slate-400">Autonomous processing with sub-second response</div>
          </div>

          <div className="text-center sm:text-left space-y-1 p-3 border-r border-slate-800/80 last:border-r-0">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              99.4<span className="text-cyan-400">%</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">Client Satisfaction SLA</div>
            <div className="text-[11px] text-slate-400">Measured across post-launch warranty reviews</div>
          </div>

          <div className="text-center sm:text-left space-y-1 p-3">
            <div className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              100<span className="text-emerald-400">%</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">Code & IP Handover Guarantee</div>
            <div className="text-[11px] text-slate-400">Private repository & schema transfer</div>
          </div>
        </div>
      </section>

      {/* 4. THE 4 IRONCLAD CLIENT GUARANTEES (THE TRUST PLEDGE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            OUR CONTRACTUAL COMMITMENT
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            Four Ironclad Client Guarantees
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            We operate with complete commercial and engineering transparency. Here is what every client is legally and contractually guaranteed:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {trustGuarantees.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 space-y-3 relative group text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE CLIENT ROI & AUTOMATION SAVINGS CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-[#060e1d] via-slate-950 to-[#040914] border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-2 text-left">
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>INTERACTIVE ROI ESTIMATOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white">
              Quantify What AI Will Save Your Business Every Month
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Select your approximate monthly customer interactions and primary automation domain to forecast recovered hours, missed-deal recapture, and speed acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Calculator Controls Left */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Service Selector Chips */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Select Primary Automation Domain
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'AI Voice Agents',
                    'WhatsApp Automation',
                    'AI Agents',
                    'Business Automation'
                  ].map((serviceName) => (
                    <button
                      key={serviceName}
                      type="button"
                      onClick={() => setCalcServiceType(serviceName)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border ${
                        calcServiceType === serviceName
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/40'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {serviceName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interaction Volume Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Monthly Calls / Inquiries
                  </label>
                  <span className="text-sm font-bold font-mono text-cyan-400 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
                    {calcInquiries.toLocaleString()} interactions/mo
                  </span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="10000" 
                  step="100" 
                  value={calcInquiries}
                  onChange={(e) => setCalcInquiries(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>200 (Boutique)</span>
                  <span>2,500 (Mid-Market)</span>
                  <span>10,000+ (Enterprise)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Projections benchmarked against live telemetry from 50+ deployed enterprise clients.</span>
              </div>
            </div>

            {/* Projections Right Display Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-500/30 space-y-6 shadow-2xl relative">
              <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                ESTIMATED MONTHLY IMPACT
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                    {roiStats.hoursSaved} <span className="text-xs text-cyan-400 font-normal">HRS/MO</span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">Labor Hours Liberated</div>
                  <div className="text-[10px] text-slate-400">Freed for high-leverage sales & strategy</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-400">
                    ${roiStats.revenueRecovered.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">Recovered Pipeline & ROI</div>
                  <div className="text-[10px] text-slate-400">Missed calls & instant lead conversion</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/50 flex items-center justify-between text-xs">
                <span className="text-slate-300">Customer Response Latency:</span>
                <span className="font-bold font-mono text-cyan-300">{roiStats.responseDrop}</span>
              </div>

              <button
                onClick={() => onSelectService(calcServiceType)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Architect A System For {calcInquiries.toLocaleString()} Interactions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. WHAT WE DO: INTELLIGENT SOLUTIONS */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#081120] border border-blue-900/40 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl space-y-3 sm:space-y-4 text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>WHAT WE DO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white tracking-tight">
              INTELLIGENT SOLUTIONS FOR MODERN BUSINESSES
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              AHSAN AI LABS creates practical AI and automation systems designed around real business problems. We eliminate repetitive friction, capture customer demand instantly, and engineer autonomous digital systems that help you scale without adding proportional operational overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 text-left">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-blue-400 font-heading font-semibold text-base">01. Eliminate Manual Drag</div>
              <p className="text-xs text-slate-400 leading-normal">
                Automate data entry, invoice processing, CRM updates, and scheduling across all your business tools.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-heading font-semibold text-base">02. Instant Customer Response</div>
              <p className="text-xs text-slate-400 leading-normal">
                Deploy 24/7 AI Voice Agents and WhatsApp Bots that qualify leads and answer customer inquiries in seconds.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 sm:col-span-2 md:col-span-1">
              <div className="text-emerald-400 font-heading font-semibold text-base">03. Custom Scalable Architecture</div>
              <p className="text-xs text-slate-400 leading-normal">
                Tailored strictly to your company data, APIs, security requirements, and long-term business goals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SECTION: SERVICES (5 PREMIUM SERVICE CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            OUR CORE EXPERTISE
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            ENGINEERED FOR MEASURABLE IMPACT
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Explore our five core pillars of enterprise intelligence and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="group relative p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-[#0d182e]/80 to-[#070e1c]/90 border border-blue-900/40 hover:border-cyan-500/60 hover:from-[#11203d]/90 hover:to-[#091326] transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1 text-left"
            >
              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-900/80 to-cyan-950/80 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/60 transition-all shadow-md shadow-cyan-950/40">
                    {renderServiceIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <span className="px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                    {service.name}
                  </h3>
                  <div className="text-xs text-blue-400 font-medium mt-0.5 font-mono">
                    {service.tagline}
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Key Benefit Highlight */}
                {service.benefits && service.benefits.length > 0 && (
                  <div className="pt-1 sm:pt-2">
                    <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 font-mono">
                      Core Advantage:
                    </div>
                    <div className="flex items-start space-x-2 text-xs text-slate-200 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/30">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{service.benefits[0]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors py-2"
                >
                  Learn More →
                </button>
                <button
                  onClick={() => onSelectService(service.name)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/25 active:scale-95"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Detailed Architecture Specifications on the Dedicated Services Page</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </section>

      {/* 8. SIDE-BY-SIDE COMPARISON: TRADITIONAL AGENCIES VS. AHSAN AI LABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            WHY CLIENTS CHOOSE US OVER TRADITIONAL AGENCIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            The Enterprise Engineering Difference
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            See how AHSAN AI LABS eliminates agency bloat, vendor lock-in, and unpredictable billing.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="p-4 sm:p-5 font-semibold text-slate-300 w-1/3">Evaluation Metric</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-400 w-1/3">Traditional Consultancies & Freelancers</th>
                  <th className="p-4 sm:p-5 font-bold text-cyan-300 bg-cyan-950/40 border-l border-cyan-500/30 w-1/3">
                    AHSAN AI LABS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Source Code & IP Ownership</td>
                  <td className="p-4 sm:p-5 text-slate-400 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Proprietary lock-in or subscription rent</span>
                  </td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>100% Full GitHub repository transfer</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Architectural Level</td>
                  <td className="p-4 sm:p-5 text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Fragile no-code tools & standard prompts</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Custom low-latency voice, Python/Node webhooks, official Meta APIs</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Pricing Model</td>
                  <td className="p-4 sm:p-5 text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Uncapped hourly billings & runaway scope</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Locked milestone pricing with agreed deliverables</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Communication Model</td>
                  <td className="p-4 sm:p-5 text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Non-technical account reps & outsourced juniors</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Direct collaboration with Principal AI Systems Architect</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-medium text-white">Post-Launch Warranty</td>
                  <td className="p-4 sm:p-5 text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Extra retainer fees for minor edge-case tweaks</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>30-Day Hypercare Warranty & active SLA included</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. SECTION: WHY AI & AUTOMATION (WITH LIVE HIGH-TECH CANVAS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Section Left: Content & Advantages */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              MEASURABLE ADVANTAGE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              WHY AI & AUTOMATION?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Modern companies that adopt autonomous systems gain a permanent speed, quality, and margin advantage. Repetitive tasks are solved in milliseconds while your team focuses on high-leverage growth.
            </p>
            
            <div className="pt-4 space-y-3">
              {[
                'Save hundreds of hours every month on manual tasks',
                'Cut customer response times from hours to under 3 seconds',
                '24/7/365 uninterrupted autonomous operations',
                'Eliminate expensive human data entry and copy-paste mistakes',
                'Scale operations without hiring large support armies'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-blue-900/60 border border-blue-600/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section Right: High-Tech Visual Canvas (ONLY visible on big screen, hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-6 relative w-full items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-[540px] xl:max-w-[580px] p-2 rounded-3xl bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-slate-950/80 border border-cyan-500/30 shadow-2xl shadow-blue-950/80 backdrop-blur-xl overflow-hidden flex items-center justify-center group">
              {/* Dynamic Animated Particle AI Canvas */}
              <AIVisualCanvas className="absolute inset-0 w-full h-full rounded-[22px] opacity-80 pointer-events-none" />

              {/* Cyber grid overlay and ambient lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* Animated orbital rings */}
              <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-[spin_35s_linear_infinite]" />
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-blue-400/30 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute w-36 h-36 rounded-full border border-cyan-400/30" />

              {/* Central Glowing AI Engine Core */}
              <div className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-950/95 via-slate-950/90 to-cyan-950/95 border border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center backdrop-blur-md transition-transform group-hover:scale-105 duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-white tracking-wider font-mono mt-1.5 uppercase">
                  AI CORE
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono font-semibold">ONLINE</span>
                </div>
              </div>

              {/* Top-Right: 99.98% System SLA */}
              <div className="absolute top-3.5 right-3.5 bg-[#081120]/90 border border-cyan-500/35 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-md flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-xs font-semibold text-slate-200 font-mono">99.98% System SLA</span>
              </div>

              {/* Top-Left: Speed & Latency */}
              <div className="absolute top-3.5 left-3.5 bg-[#081120]/90 border border-blue-500/35 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-md flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200 font-mono">&lt; 1.8s Response</span>
              </div>

              {/* Bottom-Left: 24/7 Autonomous Operations */}
              <div className="absolute bottom-3.5 left-3.5 bg-[#081120]/90 border border-cyan-500/35 rounded-xl px-3 py-2 shadow-lg backdrop-blur-md flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-900/60 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-none">24/7 Autonomous</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Zero Manual Delay</div>
                </div>
              </div>

              {/* Bottom-Right: 10x ROI Scalability */}
              <div className="absolute bottom-3.5 right-3.5 bg-[#081120]/90 border border-emerald-500/35 rounded-xl px-3 py-2 shadow-lg backdrop-blur-md flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-none">10x Scalability</div>
                  <div className="text-[9px] text-emerald-400 font-mono mt-0.5">Verified Client ROI</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 10. VERIFIED CLIENT ENDORSEMENTS & CASE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            CLIENT SUCCESS STORIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            What Leaders Say About Working With Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real feedback from enterprise operators who trust AHSAN AI LABS with their mission-critical operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {clientEndorsements.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-5 text-left relative"
            >
              <div className="space-y-3">
                {/* Stars & Metric Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                    {item.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{item.clientName}</div>
                  <div className="text-[11px] text-slate-400">{item.role} • {item.company}</div>
                  <div className="text-[10px] text-slate-500">{item.location}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-950/80 border border-blue-600/40 flex items-center justify-center shrink-0" title="Verified Client">
                  <Check className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. SECTION: DEMO SHOWCASE */}
      {displayDemos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                SYSTEM SHOWCASES
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
                PROVEN ARCHITECTURES IN ACTION
              </h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Watch real architectural recordings of our AI agents, telephony bots, and automation pipelines.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/demos')}
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-cyan-300 transition-colors self-start md:self-end"
            >
              <span>VIEW ALL DEMOS ({demos.length})</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayDemos.map((demo) => (
              <div 
                key={demo._id}
                className="group rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-blue-700/60 transition-all shadow-lg text-left"
              >
                <div>
                  {/* Video Thumbnail with Hover Overlay */}
                  <div 
                    className="relative aspect-video w-full bg-slate-950 cursor-pointer overflow-hidden"
                    onClick={() => onWatchDemo(demo)}
                  >
                    <img
                      src={demo.thumbnail}
                      alt={demo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 translate-x-0.5 fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-slate-200">
                      {demo.duration}
                    </div>
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-blue-950/90 border border-blue-700/50 text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
                      {demo.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold font-heading text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {demo.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>
                    
                    {demo.keyImpact && (
                      <div className="text-[11px] font-semibold text-cyan-400 bg-blue-950/40 p-2 rounded-lg border border-blue-900/40">
                        Impact: {demo.keyImpact}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onWatchDemo(demo)}
                    className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    <span>Watch Showcase Video</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12. SECTION: HOW IT WORKS (01 - 05 RIGOROUS LIFECYCLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            SIMPLE, TRANSPARENT & PREDICTABLE
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            How We Work With Complete Accountability
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From technical discovery to live production deployment in five structured phases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 relative text-left">
          {[
            { step: '01', title: 'DISCOVER', desc: 'Audit workflows, telephony channels, APIs, and ROI benchmarks under NDA.' },
            { step: '02', title: 'ARCHITECT', desc: 'Design schemas, prompt boundaries, security parameters, and locked milestones.' },
            { step: '03', title: 'ENGINEER', desc: 'Full-stack development of models, voice pipelines, triggers, and fail-safes.' },
            { step: '04', title: 'LOAD TEST', desc: 'Rigorous latency optimization, prompt injection resistance, and edge-case checks.' },
            { step: '05', title: 'HANDOVER', desc: '100% code transfer, staff training, active monitoring, and 30-day warranty.' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 sm:space-y-3 relative flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <div className="text-xl sm:text-2xl font-bold font-heading text-cyan-400 font-mono">
                  {item.step}
                </div>
                <h3 className="text-sm font-bold font-heading text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. HOMEPAGE TRUST & SECURITY FAQS */}
      <section className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            TRANSPARENT CLIENT FAQS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Frequently Asked Questions on Trust & Delivery
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear, upfront answers regarding code ownership, data privacy, latency, and warranties.
          </p>
        </div>

        <div className="space-y-3">
          {homeTrustFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all text-left"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 14. SECTION: FINAL HIGH-CONVERTING CTA BANNER WITH DIRECT CONSULTATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
          
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-300 bg-cyan-950/90 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>CONFIDENTIAL ARCHITECTURAL DISCOVERY • NDA GUARANTEED</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Ready to Build Your Custom AI Systems With Complete Confidence?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Tell us about your operational bottlenecks or customer communication goals. We will perform a technical review and provide a structured blueprint with locked milestones and zero surprise costs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('/get-started')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group"
            >
              <span>Schedule Architecture Discovery</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/923316041183?text=Hello%20Ahsan%20AI%20Labs%2C%20I%20reviewed%20your%20homepage%20and%20would%20like%20to%20consult%20directly%20regarding%20enterprise%20AI%20and%20automation%20architecture."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4 mr-2 text-emerald-400" />
              <span>Direct WhatsApp Consultation</span>
            </a>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>No Account Required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Direct Senior Architect Review</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Guaranteed 24-Hour Response</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
