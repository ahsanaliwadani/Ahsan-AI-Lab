import React, { useState } from 'react';
import { X, Play, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { DemoItem } from '../types';
import { parseVideoUrl } from '../utils/video';

interface VideoModalProps {
  demo: DemoItem | null;
  onClose: () => void;
  onSelectService?: (serviceName: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ demo, onClose, onSelectService }) => {
  const [videoError, setVideoError] = useState(false);
  if (!demo) return null;

  const videoInfo = parseVideoUrl(demo.videoUrl);

  // Convert category to associated service name
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#081120] border border-blue-800/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
              {demo.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Verified Production Showcase
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {videoError ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-400" />
              <div className="text-sm font-semibold text-slate-200">Unable to load this video source</div>
              <p className="text-xs text-slate-400 max-w-md">
                The video URL might be private or restricted. You can update or re-upload it via the Admin Panel Demos CMS.
              </p>
              <button
                onClick={() => setVideoError(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-cyan-400 hover:bg-slate-700 flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Retry Playback
              </button>
            </div>
          ) : videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'loom' || videoInfo.type === 'iframe' ? (
            <iframe
              src={videoInfo.embedUrl}
              title={demo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setVideoError(true)}
            />
          ) : videoInfo.type === 'direct' && videoInfo.directSrc ? (
            <video
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={demo.thumbnail}
              className="w-full h-full object-contain bg-black"
              onError={() => setVideoError(true)}
            >
              <source src={videoInfo.directSrc} type="video/mp4" />
              <source src={videoInfo.directSrc} type="video/webm" />
              <source src={videoInfo.directSrc} type="video/quicktime" />
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#081120] to-blue-950/40 p-6 text-center">
              {demo.thumbnail && (
                <img 
                  src={demo.thumbnail} 
                  alt={demo.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-25"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="relative z-10 max-w-lg space-y-3 p-4">
                <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 border border-cyan-400/40">
                  <Play className="w-7 h-7 translate-x-0.5 fill-current" />
                </div>
                <h4 className="text-xl font-bold font-heading text-white">{demo.title}</h4>
                <p className="text-sm text-slate-300">
                  Live architectural walkthrough & high-definition demonstration.
                </p>
                <div className="inline-flex items-center text-xs text-cyan-400 bg-blue-950/90 px-3 py-1 rounded-full border border-cyan-500/30">
                  Duration: {demo.duration || '03:00'} • Production Architecture
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Details & Meta */}
        <div className="p-6 overflow-y-auto space-y-4 bg-[#081120]">
          <div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">{demo.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{demo.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {demo.clientIndustry && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Target Sector</div>
                <div className="text-sm font-semibold text-slate-200">{demo.clientIndustry}</div>
              </div>
            )}
            {demo.keyImpact && (
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40">
                <div className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">Key Operational Impact</div>
                <div className="text-sm font-semibold text-cyan-300">{demo.keyImpact}</div>
              </div>
            )}
          </div>

          {demo.features && demo.features.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Demonstrated Capabilities:</div>
              <div className="flex flex-wrap gap-2">
                {demo.features.map((feat, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Need a custom AI system engineered for your operations?
            </div>
            <button
              onClick={() => {
                onClose();
                if (onSelectService) {
                  onSelectService(getServiceNameFromCategory(demo.category));
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
            >
              <span>Build This System For My Business</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

