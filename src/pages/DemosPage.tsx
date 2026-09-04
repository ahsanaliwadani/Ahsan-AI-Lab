import React, { useState } from 'react';
import { 
  Play, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Clock,
  Briefcase
} from 'lucide-react';
import { DemoItem } from '../types';

interface DemosPageProps {
  demos: DemoItem[];
  onWatchDemo: (demo: DemoItem) => void;
  onSelectService: (serviceName: string) => void;
}

export const DemosPage: React.FC<DemosPageProps> = ({
  demos,
  onWatchDemo,
  onSelectService
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'AI AGENTS',
    'AI VOICE AGENTS',
    'AI CHATBOTS',
    'BUSINESS AUTOMATION',
    'WHATSAPP AUTOMATION'
  ];

  const filteredDemos = selectedCategory === 'ALL'
    ? demos
    : demos.filter(d => d.category === selectedCategory);

  const getServiceNameFromCategory = (cat: string) => {
    switch (cat) {
      case 'AI AGENTS': return 'AI Agents';
      case 'AI VOICE AGENTS': return 'AI Voice Agents';
      case 'AI CHATBOTS': return 'AI Chatbots';
      case 'BUSINESS AUTOMATION': return 'Business Automation';
      case 'WHATSAPP AUTOMATION': return 'WhatsApp Automation';
      default: return 'AI Agents';
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION SYSTEM SHOWCASE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          ARCHITECTURAL RECORDINGS & DEMOS
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Watch recorded architectural walkthroughs and production demonstrations of our AI agents, telephony bots, and automated business workflows.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="sticky top-16 sm:top-20 z-20 backdrop-blur-md flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-lg">
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-max">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Demos Grid */}
      {demos.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center mx-auto text-blue-400">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-lg font-bold text-white">No Showcase Demos Published Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Custom system walkthroughs and client demonstrations will appear here once added in the Admin Portal.
          </p>
        </div>
      ) : filteredDemos.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <div className="text-slate-400 text-sm">No showcase videos found in this category.</div>
          <button 
            onClick={() => setSelectedCategory('ALL')} 
            className="text-xs text-blue-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDemos.map((demo) => (
            <div
              key={demo._id}
              className="group rounded-3xl bg-slate-900/70 border border-slate-800/90 overflow-hidden flex flex-col justify-between hover:border-blue-700/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40"
            >
              <div>
                {/* Thumbnail Video Trigger */}
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
                    <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl shadow-blue-600/50 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 translate-x-0.5 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-xs font-mono text-slate-200 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    {demo.duration}
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-950/90 border border-blue-700/60 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    {demo.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {demo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>

                  {demo.clientIndustry && (
                    <div className="flex items-center text-xs text-slate-400">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
                      <span>Industry: <strong className="text-slate-200">{demo.clientIndustry}</strong></span>
                    </div>
                  )}

                  {demo.keyImpact && (
                    <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/40 text-xs font-semibold text-cyan-300 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-cyan-400 shrink-0" />
                      <span>{demo.keyImpact}</span>
                    </div>
                  )}

                  {demo.features && demo.features.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                        Key Features Demonstrated:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {demo.features.map((feat, fIdx) => (
                          <span 
                            key={fIdx}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <button
                  onClick={() => onWatchDemo(demo)}
                  className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  <span>Watch Video Walkthrough</span>
                </button>
                <button
                  onClick={() => onSelectService(getServiceNameFromCategory(demo.category))}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all active:scale-95"
                >
                  <span>Request Similar Custom System</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Conversion Prompt */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/80 to-[#081120] border border-blue-800/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-1 text-left">
          <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
            Have a unique enterprise workflow in mind?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            We architect bespoke automation blueprints and AI systems for complex requirements.
          </p>
        </div>
        <button
          onClick={() => onSelectService('AI Agents')}
          className="w-full md:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 active:scale-95 text-center"
        >
          Submit Custom Project Request
        </button>
      </div>

    </div>
  );
};
