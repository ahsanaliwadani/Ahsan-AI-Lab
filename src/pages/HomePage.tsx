import React from 'react';
import { 
  Bot, 
  Mic, 
  MessageSquare, 
  Zap, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  FileCheck, 
  Headphones, 
  Rocket, 
  Lock
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

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 sm:pt-40 pb-16 lg:pb-24 overflow-hidden">
        {/* Futuristic background ambient lighting and cyber grid overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              {/* High-Tech Radar Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-cyan-950/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-950/40">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <span className="tracking-widest uppercase font-mono text-[11px]">
                  {content?.hero?.badge || 'ENTERPRISE AI & AUTOMATION SYSTEMS'}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.08]">
                BUILD A SMARTER <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_25px_rgba(0,210,255,0.25)]">
                  BUSINESS WITH AI.
                </span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                {content?.hero?.subtitle || 
                  'We engineer enterprise-grade AI agents, telephony voice assistants, intelligent chatbots, automated business pipelines, and Meta WhatsApp digital systems that empower companies to scale effortlessly.'}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigate('/get-started')}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-cyan-600/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  <span>GET STARTED</span>
                  <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/services')}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 hover:text-white font-semibold text-base border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <span>EXPLORE SERVICES</span>
                </button>
              </div>

              {/* Micro Trust Proofs */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">Custom Engineered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-300">24/7 Autonomous</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Measurable ROI</span>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Canvas */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto p-1 rounded-3xl bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent border border-cyan-500/30 shadow-2xl shadow-blue-950/80">
                <AIVisualCanvas className="w-full h-full rounded-[22px] overflow-hidden" />
                
                {/* Floating Micro Status Badges */}
                <div className="absolute -bottom-4 -left-4 bg-[#081120]/95 border border-cyan-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">n8n Orchestration</div>
                    <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Status: Production Live
                    </div>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-[#081120]/95 border border-cyan-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-5" />
                  <span className="text-xs font-semibold text-slate-200 font-mono">99.98% SLA</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION: WHAT WE DO */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#081120] border border-blue-900/40 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
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
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-heading font-semibold text-base">03. Custom Scalable Architecture</div>
              <p className="text-xs text-slate-400 leading-normal">
                Tailored strictly to your company data, APIs, security requirements, and long-term business goals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION: SERVICES (5 PREMIUM SERVICE CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            OUR CORE EXPERTISE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            ENGINEERED FOR MEASURABLE IMPACT
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Explore our five core pillars of enterprise intelligence and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0d182e]/80 to-[#070e1c]/90 border border-blue-900/40 hover:border-cyan-500/60 hover:from-[#11203d]/90 hover:to-[#091326] transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-cyan-950/40 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900/80 to-cyan-950/80 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/60 transition-all shadow-md shadow-cyan-950/40">
                    {renderServiceIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <div>
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
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
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
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
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  Learn More →
                </button>
                <button
                  onClick={() => onSelectService(service.name)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/25 active:scale-95"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Detailed Specifications on the Dedicated Services Page</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </section>

      {/* 4. SECTION: WHY AI & AUTOMATION? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4 text-left">
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

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content?.metrics && content.metrics.map((metric, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#081120] border border-slate-800 p-6 space-y-2 relative overflow-hidden"
              >
                <div className="text-3xl sm:text-4xl font-bold font-heading text-white">
                  {metric.value} <span className="text-xs text-cyan-400 font-normal uppercase">{metric.suffix}</span>
                </div>
                <div className="text-sm font-medium text-slate-300">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-500">
                  Verified across production enterprise client deployments.
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SECTION: DEMO SHOWCASE */}
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
              className="group rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-blue-700/60 transition-all shadow-lg"
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

      {/* 6. SECTION: HOW IT WORKS (01 - 05 PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            SIMPLE & PREDICTABLE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
            HOW IT WORKS
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From initial requirements to live production delivery in five structured steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'EXPLORE', desc: 'Choose the service or automation system that fits your business needs.' },
            { step: '02', title: 'SUBMIT REQUIREMENTS', desc: 'Tell us about your company workflows and the exact problem to solve.' },
            { step: '03', title: 'WE REVIEW', desc: 'Our AI engineers analyze your specs and construct the technical blueprint.' },
            { step: '04', title: 'WE CONTACT YOU', desc: 'We reach out via your preferred method (WhatsApp, Email, or Call).' },
            { step: '05', title: 'BUILD & DELIVER', desc: 'We build, test rigorously, deploy, and provide continuous support.' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="text-2xl font-bold font-heading text-blue-500 font-mono">
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

      {/* 7. SECTION: WHY AHSAN AI LABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-blue-900/50 shadow-2xl space-y-10">
          
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              ENGINEERING INTEGRITY
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white">
              WHY AHSAN AI LABS
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              We stand apart through rigorous engineering, transparent communication, and systems that actually deliver measurable business return.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp className="w-5 h-5 text-cyan-400" />, title: 'Business-Focused Solutions', desc: 'We focus strictly on concrete ROI: hours saved, conversions increased, costs lowered.' },
              { icon: <Layers className="w-5 h-5 text-blue-400" />, title: 'Custom AI Systems', desc: 'Bespoke architectures built around your proprietary data and workflow rules.' },
              { icon: <Zap className="w-5 h-5 text-amber-400" />, title: 'Automation-First Approach', desc: 'Zero manual handoffs. Seamless integration across your existing tools and APIs.' },
              { icon: <Lock className="w-5 h-5 text-emerald-400" />, title: 'Enterprise Security', desc: 'End-to-end data encryption, webhook signature validation, and secure credentials.' }
            ].map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold font-heading text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. SECTION: FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-900/80 via-[#081120] to-blue-950/80 border border-blue-700/50 text-center space-y-6 relative overflow-hidden shadow-2xl">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight">
              READY TO BUILD SOMETHING INTELLIGENT?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell us what you want to automate, improve, or build. Our engineering team is ready to analyze your requirements and build a production-ready solution.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('/get-started')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-200 shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-100"
            >
              <span>START YOUR PROJECT</span>
              <ArrowRight className="w-5 h-5 ml-2.5" />
            </button>
          </div>

          <div className="text-xs text-slate-400">
            No account required • Instant automated WhatsApp confirmation • 24h engineer review
          </div>

        </div>
      </section>

    </div>
  );
};
