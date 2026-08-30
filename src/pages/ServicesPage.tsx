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
  TrendingUp
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

  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION-READY AI SOLUTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          ENTERPRISE SERVICES & ARCHITECTURES
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comprehensive, custom-built AI and automation systems designed to resolve bottlenecks, eliminate manual toil, and scale your operations 24/7.
        </p>
      </div>

      {/* Interactive Service Navigation Selector */}
      <div className="sticky top-20 z-30 bg-[#081120]/95 backdrop-blur-md p-2 rounded-2xl border border-blue-900/40 shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start sm:justify-center min-w-max space-x-2">
          {services.map((srv) => {
            const isActive = srv.slug === activeSlug;
            return (
              <button
                key={srv.slug}
                onClick={() => setActiveSlug(srv.slug)}
                className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/50'
                }`}
              >
                {renderServiceIcon(srv.iconName, 'w-4 h-4')}
                <span>{srv.name}</span>
                {srv.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
                    isActive ? 'bg-blue-800 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {srv.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Service Detailed Presentation */}
      {currentService && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* Service Hero Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#081120] to-blue-950/40 border border-blue-800/50 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-900/60 border border-blue-600/50 flex items-center justify-center">
                    {renderServiceIcon(currentService.iconName, 'w-6 h-6')}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white">
                      {currentService.name}
                    </h2>
                    <div className="text-xs sm:text-sm text-cyan-400 font-medium">
                      {currentService.tagline}
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                  {currentService.fullDescription}
                </p>

                {/* Direct CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => onSelectService(currentService.name)}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-100"
                  >
                    <span>{currentService.ctaText || `REQUEST ${currentService.name.toUpperCase()}`}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  {matchedDemo && (
                    <button
                      onClick={() => onWatchDemo(matchedDemo)}
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
                    >
                      <Play className="w-4 h-4 mr-2 text-cyan-400 fill-current" />
                      <span>Watch System Demo Video</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Spec Highlights */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-cyan-400" />
                  System Assurance
                </div>
                
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Deployment SLA</span>
                    <span className="font-semibold text-white">5 - 14 Days</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Security Standard</span>
                    <span className="font-semibold text-emerald-400">Encrypted / Isolated</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Integration Layer</span>
                    <span className="font-semibold text-blue-400">n8n / REST APIs / Webhooks</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Ongoing Support</span>
                    <span className="font-semibold text-white">Continuous Monitoring</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Grid: Features & Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Features Card */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  CORE SPECIFICATIONS
                </div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Included Features
                </h3>
              </div>

              <div className="space-y-3">
                {currentService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-blue-900/50 border border-blue-600/40 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Capabilities Card */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  ADVANCED CAPABILITIES
                </div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Engineering Capabilities
                </h3>
              </div>

              <div className="space-y-3">
                {currentService.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-cyan-950/60 border border-cyan-700/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Real-World Use Cases */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                APPLICATION SCENARIOS
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Proven Enterprise Use Cases
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentService.useCases.map((uc, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    Scenario 0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold font-heading text-white">
                    {uc.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Benefits & Direct Action Bottom Bar */}
          <div className="p-8 rounded-3xl bg-blue-950/40 border border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
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

            <button
              onClick={() => onSelectService(currentService.name)}
              className="w-full md:w-auto shrink-0 inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30"
            >
              <span>{currentService.ctaText || `ORDER ${currentService.name.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
