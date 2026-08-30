import React from 'react';
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
  Smartphone
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
  const founder = content?.founder || {
    name: 'Ahsan Ali',
    title: 'Founder & Principal AI Systems Architect',
    bio: 'Ahsan Ali is an AI automation architect and engineer dedicated to helping forward-thinking enterprises bridge the gap between cutting-edge artificial intelligence and high-ROI business operations. With deep expertise across autonomous agents, telephony voice AI, and scalable API orchestration, Ahsan leads the engineering team at AHSAN AI LABS to deliver robust, enterprise-grade digital systems.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    quote: 'True business transformation happens when artificial intelligence moves from theoretical experiments into reliable, everyday autonomous execution.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      github: 'https://github.com',
      email: 'ahsan@ahsanailabs.com',
      whatsapp: '+1234567890'
    }
  };

  const about = content?.about || {
    mission: 'To empower modern businesses with resilient, enterprise-grade AI and automation systems that eliminate manual friction, accelerate execution, and maximize profitability.',
    vision: 'To build the digital infrastructure of tomorrow—where intelligent autonomous agents and automated workflows power seamless global enterprise operations.',
    companyDescription: 'AHSAN AI LABS is an international technology company focused exclusively on practical, production-ready AI and automation solutions. We don\'t build novelty toys or empty concepts; we build mission-critical systems that drive measurable ROI.',
    pillars: [],
    processSteps: []
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. Page Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ABOUT AHSAN AI LABS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          BUILDING SMARTER BUSINESSES WITH AI
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          We are an international AI, automation, and digital solutions engineering company committed to making modern enterprises faster, smarter, and autonomous.
        </p>
      </div>

      {/* 2. WHO WE ARE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            WHO WE ARE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Practical AI Systems Engineered for Concrete Business Outcomes
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.companyDescription}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Unlike traditional consulting agencies that deliver slide decks, AHSAN AI LABS architects and builds production-grade software: autonomous AI agents, telephony voice systems, automated CRM synchronization, and conversational WhatsApp business engines.
          </p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Production Grade</h3>
            <p className="text-xs text-slate-400">Zero demo fluff. Every architecture is built for 24/7 uptime and data security.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Automation First</h3>
            <p className="text-xs text-slate-400">End-to-end integration across your existing tools, databases, and APIs.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Measurable ROI</h3>
            <p className="text-xs text-slate-400">We quantify hours saved, missed calls recovered, and conversion boosts.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white">Modern AI Stack</h3>
            <p className="text-xs text-slate-400">Modern multi-modal models, telephony low-latency voice, and n8n pipelines.</p>
          </div>
        </div>
      </div>

      {/* 3. MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-blue-950/30 border border-blue-800/50 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <Target className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">OUR MISSION</h3>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Empowering Modern Enterprises Through Autonomous Intelligence
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.mission}
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Eye className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">OUR VISION</h3>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold font-heading text-white">
            The Digital Infrastructure of Tomorrow
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.vision}
          </p>
        </div>
      </div>

      {/* 4. WHAT WE BUILD (All 5 Services) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            WHAT WE BUILD
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Five Pillars of AI & Automation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'AI Agents', icon: <Bot className="w-5 h-5 text-blue-400" />, desc: 'Autonomous systems executing multi-step operations.' },
            { name: 'AI Voice Agents', icon: <Mic className="w-5 h-5 text-cyan-400" />, desc: 'Human-parity conversational phone assistants.' },
            { name: 'AI Chatbots', icon: <MessageSquare className="w-5 h-5 text-blue-400" />, desc: 'Omnichannel customer support & lead capture.' },
            { name: 'Business Automation', icon: <Zap className="w-5 h-5 text-amber-400" />, desc: 'API orchestration, n8n workflows, ERP sync.' },
            { name: 'WhatsApp Automation', icon: <Smartphone className="w-5 h-5 text-emerald-400" />, desc: 'Official Cloud API booking & sales bots.' }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectService(item.name)}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-700/60 cursor-pointer transition-all space-y-2 group"
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

      {/* 5. HOW WE WORK (Understand → Plan → Build → Test → Deliver) */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-slate-800 space-y-8">
        <div className="text-left space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            ENGINEERING METHODOLOGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            How We Work
          </h2>
          <p className="text-sm text-slate-300">
            A battle-tested five-stage development lifecycle to ensure high reliability and zero downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'UNDERSTAND', desc: 'Deep analysis of workflows, team friction, APIs, and business metrics.' },
            { step: '02', title: 'PLAN', desc: 'Architecting schemas, security perimeters, agent prompt guidelines, and triggers.' },
            { step: '03', title: 'BUILD', desc: 'Full-stack engineering of models, webhooks, voice telephony, and n8n scripts.' },
            { step: '04', title: 'TEST', desc: 'Multi-scenario load testing, prompt injection resistance, and fallback checks.' },
            { step: '05', title: 'DELIVER', desc: 'Production launch, staff training, live telemetry, and ongoing optimization.' }
          ].map((st, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <div className="text-xl font-bold font-mono text-blue-400">{st.step}</div>
              <h4 className="text-sm font-bold font-heading text-white">{st.title}</h4>
              <p className="text-xs text-slate-400">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FOUNDER SECTION */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-[#081120] border border-blue-800/40 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-blue-600/60 shadow-xl shadow-blue-950/60">
              <img 
                src={founder.photoUrl} 
                alt={founder.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold font-heading text-white">{founder.name}</h3>
              <div className="text-xs font-semibold text-cyan-400 mt-0.5">{founder.title}</div>
            </div>

            {/* Founder Social Links */}
            <div className="flex items-center space-x-2 pt-1">
              {founder.socials.linkedin && (
                <a 
                  href={founder.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition-colors"
                  title="LinkedIn"
                  aria-label="Founder LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {founder.socials.twitter && (
                <a 
                  href={founder.socials.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-400 transition-colors"
                  title="Twitter / X"
                  aria-label="Founder Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {founder.socials.github && (
                <a 
                  href={founder.socials.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="GitHub"
                  aria-label="Founder GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {founder.socials.email && (
                <a 
                  href={`mailto:${founder.socials.email}`} 
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-red-600 transition-colors"
                  title="Email"
                  aria-label="Founder Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              LEADERSHIP & ENGINEERING PHILOSOPHY
            </div>
            
            <blockquote className="text-base sm:text-lg italic font-heading text-slate-200 border-l-2 border-cyan-400 pl-4 py-1">
              "{founder.quote}"
            </blockquote>

            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {founder.bio}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigate('/get-started')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/30"
              >
                <span>Consult With Our Engineering Team</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
