import React from 'react';
import { Mail, Phone, MessageSquare, ArrowUpRight, Shield, Globe } from 'lucide-react';
import { SiteSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
  onSelectService?: (serviceName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onSelectService }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    } else {
      onNavigate('/services');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#040913] text-slate-400 border-t border-blue-950/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo 
              size="lg" 
              onClick={() => handleNavClick('/')}
            />

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              We design and deploy mission-critical AI agents, telephony voice assistants, custom conversational chatbots, end-to-end business automations, and official WhatsApp Cloud API systems for modern enterprises worldwide.
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <a 
                href={`https://wa.me/${settings?.whatsappDirectNumber || '923316041183'}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs text-slate-300 hover:text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                <span>WhatsApp Business</span>
              </a>
              <a 
                href={`mailto:${settings?.primaryEmail || 'contact@ahsanailabs.com'}`}
                className="inline-flex items-center space-x-2 text-xs text-slate-300 hover:text-blue-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{settings?.primaryEmail || 'contact@ahsanailabs.com'}</span>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-200 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNavClick('/')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/services')} className="hover:text-white transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/demos')} className="hover:text-white transition-colors">
                  Showcase & Demos
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/about')} className="hover:text-white transition-colors">
                  About Us & Founder
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/contact')} className="hover:text-white transition-colors">
                  Contact & Consultation
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/get-started')} className="text-blue-400 font-semibold hover:text-cyan-300 transition-colors inline-flex items-center">
                  <span>Get Started / Order</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Core Services */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-200 mb-4">
              Core Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleServiceClick('AI Agents')} className="hover:text-white transition-colors text-left">
                  🤖 AI Agents
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('AI Voice Agents')} className="hover:text-white transition-colors text-left">
                  🎙️ AI Voice Agents
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('AI Chatbots')} className="hover:text-white transition-colors text-left">
                  💬 AI Chatbots
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('Business Automation')} className="hover:text-white transition-colors text-left">
                  ⚡ Business Automation
                </button>
              </li>
              <li>
                <button onClick={() => handleServiceClick('WhatsApp Automation')} className="hover:text-white transition-colors text-left">
                  📱 WhatsApp Automation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Social */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-200 mb-4">
              Enterprise & Social
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="font-semibold text-slate-200 flex items-center mb-1">
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Enterprise Grade
                </div>
                <p className="text-slate-400 leading-normal">
                  End-to-end encrypted integrations, zero plain-text leaks, n8n webhook automation architecture.
                </p>
              </div>

              <div className="pt-2">
                <div className="text-slate-400 text-xs mb-2">Connect with our brand:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {settings?.socialLinks?.linkedin && (
                    <a
                      href={settings.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {settings?.socialLinks?.twitter && (
                    <a
                      href={settings.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-400 transition-colors"
                    >
                      X (Twitter)
                    </a>
                  )}
                  {settings?.socialLinks?.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {settings?.socialLinks?.youtube && (
                    <a
                      href={settings.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-red-500 transition-colors"
                    >
                      YouTube
                    </a>
                  )}
                  {settings?.socialLinks?.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-600 transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} AHSAN AI LABS. All rights reserved. • Intelligence. Automation. Innovation.
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-slate-400">
              <Globe className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Global Cloud Infrastructure
            </span>
            <button 
              onClick={() => handleNavClick('/admin')}
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
