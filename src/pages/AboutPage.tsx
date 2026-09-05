import React, { useState } from 'react';
import { 
  Cpu, 
  Target, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Linkedin,
  Twitter,
  Github,
  Mail,
  MessageSquare,
  Bot,
  Mic,
  Zap,
  Smartphone,
  Lock,
  FileCheck2,
  Clock,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Server,
  Star,
  Check,
  Building2,
  Shield
} from 'lucide-react';
import { CompanyContent } from '../types';

interface AboutPageProps {
  content?: CompanyContent;
  onNavigate: (path: string) => void;
  onSelectService: (serviceName: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  content,
  onNavigate,
  onSelectService
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const founder = content?.founder || {
    name: 'Ahsan Ali',
    title: 'Founder & Principal AI Systems Architect',
    bio: 'Ahsan Ali is an AI automation architect and engineer dedicated to helping forward-thinking enterprises bridge the gap between cutting-edge artificial intelligence and high-ROI business operations. With deep expertise across autonomous agents, telephony voice AI, and scalable API orchestration, Ahsan leads the engineering team at AHSAN AI LABS to deliver robust, enterprise-grade digital systems.',
    photoUrl: '/founder.jpg',
    quote: 'True business transformation happens when artificial intelligence moves from theoretical experiments into reliable, everyday autonomous execution.',
    socials: {
      linkedin: 'https://linkedin.com/in/ahsanali',
      twitter: 'https://x.com/ahsanali',
      email: 'ahsan@ahsanailabs.com',
      whatsapp: '+92 331 6041183'
    }
  };

  const about = content?.about || {
    mission: 'To empower modern businesses with resilient, enterprise-grade AI and automation systems that eliminate manual friction, accelerate execution, and maximize profitability.',
    vision: 'To build the digital infrastructure of tomorrow—where intelligent autonomous agents and automated workflows power seamless global enterprise operations.',
    companyDescription: 'AHSAN AI LABS is an international technology company focused exclusively on practical, production-ready AI and automation solutions. We don\'t build novelty toys or empty concepts; we build mission-critical systems that drive measurable ROI.',
    pillars: [],
    processSteps: []
  };

  const trustGuarantees = [
    {
      icon: <FileCheck2 className="w-6 h-6 text-cyan-400" />,
      title: '100% Client Code & IP Ownership',
      description: 'You own everything we build. Upon delivery, full source code, architecture diagrams, and system configurations are transferred directly to your organization. Zero vendor lock-in.',
      badge: 'Full Ownership'
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'Enterprise NDA & Strict Data Confidentiality',
      description: 'Your proprietary workflows, databases, and customer records remain 100% confidential. We sign comprehensive mutual NDAs, and client data is never used to train public AI models.',
      badge: 'NDA Guaranteed'
    },
    {
      icon: <Award className="w-6 h-6 text-blue-400" />,
      title: 'Milestone-Based Fixed Transparent Pricing',
      description: 'No unpredictable hourly billings or surprise invoices. Every phase has clear deliverables, measurable acceptance criteria, and locked-in milestones before writing a single line of code.',
      badge: 'Zero Surprise Fees'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: '30-Day Hypercare Warranty & Active SLA',
      description: 'Every production launch includes 30 days of active monitoring, edge-case tuning, load-testing verification, and team training to ensure flawless day-to-day operations.',
      badge: 'Hypercare Included'
    }
  ];

  const securityStandards = [
    {
      title: 'End-to-End Encryption',
      desc: 'AES-256 bit encryption at rest and TLS 1.3 in transit across all webhooks, databases, and telephony pipes.',
      icon: <Lock className="w-4 h-4 text-cyan-400" />
    },
    {
      title: 'Official Meta Cloud API',
      desc: 'Built using officially verified Meta WhatsApp Cloud API credentials for 100% compliance with zero ban risk.',
      icon: <Smartphone className="w-4 h-4 text-emerald-400" />
    },
    {
      title: 'Secure Secret Vaulting',
      desc: 'No hardcoded credentials. All LLM, Twilio, database, and CRM tokens are stored in isolated encrypted vaults.',
      icon: <Shield className="w-4 h-4 text-blue-400" />
    },
    {
      title: 'Human-in-the-Loop Fallbacks',
      desc: 'Automated fallback routing and human staff escalations ensure 100% reliable fail-safe handling.',
      icon: <Users className="w-4 h-4 text-purple-400" />
    }
  ];

  const clientEndorsements = [
    {
      quote: 'Ahsan AI Labs built our autonomous voice receptionist in 3 weeks. It handles 85+ calls every evening, books appointments on Google Calendar, and recovered $18,000 in missed bookings within the first month.',
      clientName: 'Dr. Tariq M.',
      role: 'Operations Director',
      industry: 'Healthcare & Wellness Group',
      location: 'Dubai, UAE',
      metric: '+38% Booking Recovery',
      stars: 5
    },
    {
      quote: 'Our WhatsApp customer response time went from 4 hours to 3 seconds. The lead qualification chatbot integrates directly with our CRM, saving our sales team 25 hours every single week.',
      clientName: 'Sarah Jenkins',
      role: 'Head of Growth',
      industry: 'Direct-to-Consumer Retail',
      location: 'London, United Kingdom',
      metric: '99.2% Instant Response Rate',
      stars: 5
    },
    {
      quote: 'Zero fluff, pure engineering excellence. Ahsan delivered clean, well-documented source code that our internal team easily adopted. The transparent milestone structure gave our board full confidence.',
      clientName: 'Marcus Vance',
      role: 'Chief Technology Officer',
      industry: 'Logistics & Supply Chain',
      location: 'Dallas, TX, USA',
      metric: '100% Source Code Transfer',
      stars: 5
    }
  ];

  const trustFaqs = [
    {
      q: 'Do we own the custom AI agents, workflows, and source code?',
      a: 'Yes, absolutely. 100% of the custom codebase, prompt engineering templates, database schemas, and workflow automation blueprints belong entirely to your company. We provide complete GitHub repository transfer, credential handover, and technical documentation upon milestone sign-off.'
    },
    {
      q: 'Is our sensitive company or customer data used to train public AI models?',
      a: 'Never. We strictly utilize enterprise API endpoints with zero-data-retention (ZDR) agreements from model providers (e.g. OpenAI Enterprise, Anthropic, Google Cloud Vertex). Your proprietary data and customer conversations are never exposed to public training sets.'
    },
    {
      q: 'Do you sign an NDA before we discuss our proprietary workflows?',
      a: 'Yes. Before reviewing internal systems, customer databases, or proprietary operational workflows, we execute a comprehensive mutual Non-Disclosure Agreement (NDA) to ensure full legal protection.'
    },
    {
      q: 'What happens if an external API or voice telephony service experiences an outage?',
      a: 'Every enterprise system we architect incorporates resilient multi-tier fallback mechanisms. If an LLM provider or voice gateway faces transient latency, the system automatically routes to secondary fallback models or notifies human staff via emergency SMS/Slack alerts with zero data loss.'
    },
    {
      q: 'How does your 30-day Hypercare Warranty work?',
      a: 'Following production deployment, our engineering team actively monitors live performance logs, conversation success rates, and system latency for 30 consecutive days. Any necessary prompt adjustments, edge-case patches, or operational fine-tuning are addressed promptly at no additional cost.'
    },
    {
      q: 'Will I communicate directly with engineers or sales representatives?',
      a: 'You work directly with Ahsan Ali and senior AI systems architects. We eliminate non-technical intermediaries so your technical requirements are understood with precision and executed without communication friction.'
    }
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      
      {/* 1. Page Hero with High Trust Accents */}
      <div className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>VERIFIED ENTERPRISE AI ARCHITECTS • ZERO VENDOR LOCK-IN</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.12]">
          PRACTICAL AI SYSTEMS BUILT ON{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            TRANSPARENCY & TRUST.
          </span>
        </h1>
        
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
          AHSAN AI LABS is an international AI engineering firm specializing in autonomous agents, voice telephony, and digital business automation. We bridge the gap between bleeding-edge artificial intelligence and measurable, battle-tested business ROI.
        </p>

        {/* Live Trust Badges Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>100% Client Code Ownership</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise Mutual NDA Included</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>99.98% System Uptime SLA</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>30-Day Post-Launch Warranty</span>
          </div>
        </div>
      </div>

      {/* 2. PROVEN TRACK RECORD METRICS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a1526]/90 to-slate-950 border border-cyan-500/20 shadow-2xl backdrop-blur-xl">
        <div className="text-center sm:text-left space-y-1 p-3 border-r border-slate-800/80 last:border-r-0">
          <div className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            50<span className="text-cyan-400">+</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-200">Production Systems Shipped</div>
          <div className="text-[11px] text-slate-400">Deployed across US, UK, UAE & Global Markets</div>
        </div>

        <div className="text-center sm:text-left space-y-1 p-3 border-r border-slate-800/80 last:border-r-0">
          <div className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            1.2M<span className="text-cyan-400">+</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-200">Conversations & Calls Processed</div>
          <div className="text-[11px] text-slate-400">Handled autonomously with human parity</div>
        </div>

        <div className="text-center sm:text-left space-y-1 p-3 border-r border-slate-800/80 last:border-r-0">
          <div className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            99.4<span className="text-cyan-400">%</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-200">Client Satisfaction Rate</div>
          <div className="text-[11px] text-slate-400">Measured across post-launch warranty reviews</div>
        </div>

        <div className="text-center sm:text-left space-y-1 p-3">
          <div className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            100<span className="text-emerald-400">%</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-200">Code & IP Transfer Guarantee</div>
          <div className="text-[11px] text-slate-400">Full source code & documentation handover</div>
        </div>
      </div>

      {/* 3. THE 4 IRONCLAD CLIENT GUARANTEES (THE TRUST PLEDGE) */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            THE AHSAN AI LABS PROMISE
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white">
            Four Ironclad Client Guarantees
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            We operate with complete commercial and engineering transparency. Here is what every client is contractually guaranteed:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {trustGuarantees.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 space-y-3 relative group"
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
      </div>

      {/* 4. WHO WE ARE & WHAT DRIVES US */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center p-6 sm:p-10 lg:p-12 rounded-3xl bg-slate-900/50 border border-slate-800">
        <div className="lg:col-span-6 space-y-5 text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            OUR IDENTITY & MISSION
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white leading-tight">
            We Build Mission-Critical Infrastructure, Not Disposable Toys
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.companyDescription}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Unlike marketing consultancies that charge for slide decks, AHSAN AI LABS functions as your external Principal AI Engineering division. We design, write, test, and maintain real production software that directly drives operational efficiency.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct communication with technical architects (zero non-technical account reps)</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Auditable system logs and real-time operational telemetry</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fully documented API webhooks and database integration guides</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Production Grade</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Zero demo fluff. Every architecture is engineered for 24/7 uptime and enterprise-grade resilience.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Automation First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Deep bi-directional sync across your existing CRMs, Google/Outlook calendars, and ERPs.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Quantifiable ROI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We measure success by concrete KPIs: recovered missed calls, reduced labor hours, and boosted pipeline.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Modern AI Stack</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Low-latency telephony voice models, agentic tool-calling, and secure cloud serverless execution.</p>
          </div>
        </div>
      </div>

      {/* 5. ENTERPRISE SECURITY & DATA GOVERNANCE STANDARDS */}
      <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-[#060e1d] to-slate-950 border border-cyan-500/20 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1 text-left">
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              SECURITY & COMPLIANCE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Enterprise Data Security by Architecture
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero Data Retention Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityStandards.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center">
                {item.icon}
              </div>
              <h4 className="text-sm font-bold font-heading text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. VERIFIED CLIENT ENDORSEMENTS */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            CLIENT SUCCESS STORIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white">
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
                  <div className="text-[11px] text-slate-400">{item.role} • {item.industry}</div>
                  <div className="text-[10px] text-slate-500">{item.location}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-950/80 border border-blue-600/40 flex items-center justify-center shrink-0" title="Verified Client">
                  <Check className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. WHAT WE BUILD (All 5 Pillars) */}
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            CORE DOMAINS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Five Pillars of AI & Automation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[
            { name: 'AI Agents', icon: <Bot className="w-5 h-5 text-blue-400" />, desc: 'Autonomous multi-step business process executors.' },
            { name: 'AI Voice Agents', icon: <Mic className="w-5 h-5 text-cyan-400" />, desc: 'Human-parity conversational telephone assistants.' },
            { name: 'AI Chatbots', icon: <MessageSquare className="w-5 h-5 text-blue-400" />, desc: 'Omnichannel lead qualification and support agents.' },
            { name: 'Business Automation', icon: <Zap className="w-5 h-5 text-amber-400" />, desc: 'API orchestration, cloud pipelines, and ERP sync.' },
            { name: 'WhatsApp Automation', icon: <Smartphone className="w-5 h-5 text-emerald-400" />, desc: 'Official Cloud API booking & broadcast bots.' }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectService(item.name)}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. HOW WE WORK: RIGOROUS 5-STAGE LIFECYCLE */}
      <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 sm:space-y-8">
        <div className="text-left space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            ENGINEERING METHODOLOGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            How We Work With Complete Accountability
          </h2>
          <p className="text-sm text-slate-300">
            A battle-tested five-stage development lifecycle to ensure high reliability, zero downtime, and transparent handoffs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[
            { step: '01', title: 'UNDERSTAND', desc: 'Technical workflow discovery, API audit, prompt safety rules, and ROI benchmarks.' },
            { step: '02', title: 'PLAN', desc: 'System architecture, database schema, security boundaries, and locked milestone scopes.' },
            { step: '03', title: 'BUILD', desc: 'Full-stack engineering of models, telephony routing, API triggers, and resilient fallbacks.' },
            { step: '04', title: 'TEST', desc: 'Rigorous load testing, prompt injection resistance, edge-case validation, and latency tuning.' },
            { step: '05', title: 'DELIVER', desc: 'Repository code transfer, staff training, 30-day hypercare warranty, and active telemetry.' }
          ].map((st, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-left">
              <div className="text-xl font-bold font-mono text-cyan-400">{st.step}</div>
              <h4 className="text-sm font-bold font-heading text-white">{st.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9. FOUNDER & PRINCIPAL ARCHITECT */}
      <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#071324] to-[#040a14] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
          
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/60">
              <img 
                src={founder.photoUrl} 
                alt={founder.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-1 rounded-lg backdrop-blur-md border border-cyan-500/30">
                <span>VERIFIED ARCHITECT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold font-heading text-white">{founder.name}</h3>
              <div className="text-xs font-semibold text-cyan-400 mt-0.5">{founder.title}</div>
            </div>

            {/* Founder Social Links & Direct Reach */}
            <div className="flex items-center space-x-2 pt-1">
              {founder.socials.linkedin && founder.socialsEnabled?.linkedin !== false && (
                <a 
                  href={founder.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                  title="Connect on LinkedIn"
                  aria-label="Founder LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {founder.socials.twitter && founder.socialsEnabled?.twitter !== false && (
                <a 
                  href={founder.socials.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-400 transition-colors"
                  title="Twitter / X"
                  aria-label="Founder Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {founder.socials.whatsapp && founder.socialsEnabled?.whatsapp !== false && (
                <a 
                  href={`https://wa.me/${founder.socials.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Ahsan, I would like to consult with you regarding enterprise AI and automation architecture.')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600 transition-colors"
                  title="Direct WhatsApp"
                  aria-label="Founder WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
              {founder.socials.email && founder.socialsEnabled?.email !== false && (
                <a 
                  href={`mailto:${founder.socials.email}`} 
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                  title="Send Email"
                  aria-label="Founder Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {founder.socials.github && founder.socialsEnabled?.github !== false && (
                <a 
                  href={founder.socials.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-purple-600 transition-colors"
                  title="GitHub"
                  aria-label="Founder GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIRECT LEADERSHIP & ARCHITECTURAL OVERSIGHT</span>
            </div>
            
            <blockquote className="text-base sm:text-lg italic font-heading text-slate-200 border-l-2 border-cyan-400 pl-4 py-1">
              "{founder.quote}"
            </blockquote>

            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              {founder.bio}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>The Direct Architect Guarantee</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                "When you partner with AHSAN AI LABS, your project is not outsourced to anonymous contractors. I personally oversee system architecture, prompt engineering guidelines, and security reviews for every production release."
              </p>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigate('/get-started')}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <span>Schedule Architecture Discovery</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <a
                href={`https://wa.me/${(founder.socials.whatsapp || '+923316041183').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Ahsan, I reviewed your About page and would like to speak directly with you.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold tracking-wider transition-all"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Direct WhatsApp Consultation</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 10. TRUST & SECURITY FAQ ACCORDION */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            TRANSPARENT ANSWERS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Frequently Asked Questions on Trust & Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear, honest answers regarding data protection, source code ownership, and warranties.
          </p>
        </div>

        <div className="space-y-3">
          {trustFaqs.map((faq, idx) => {
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
      </div>

      {/* 11. FINAL BOTTOM TRUST BANNER / CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/30 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>CONFIDENTIAL & NDA PROTECTED</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
            Ready to Build Your AI Systems with Complete Confidence?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tell us about your business bottlenecks. We will conduct a thorough architectural assessment and provide a detailed blueprint with fixed milestones and zero surprises.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/get-started')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 active:scale-95"
          >
            <span>Start Your Discovery</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          
          <button
            onClick={() => onNavigate('/contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
          >
            <span>Speak With Our Team</span>
          </button>
        </div>
      </div>

    </div>
  );
};

