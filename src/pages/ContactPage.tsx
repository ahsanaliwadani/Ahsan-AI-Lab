import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Globe, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  Bot,
  Zap,
  HelpCircle
} from 'lucide-react';
import { SiteSettings } from '../types';

interface ContactPageProps {
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    service: 'AI Voice Agents',
    subject: '',
    message: '',
    preferredContact: 'WhatsApp',
    hp_field: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedInquiryId, setSubmittedInquiryId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setStatus('submitting');
    try {
      // Submit to dedicated contact endpoint
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          companyName: formData.company || 'Direct Contact',
          email: formData.email,
          whatsapp: formData.whatsapp || 'Not provided',
          service: formData.service,
          subject: formData.subject || `${formData.service} Inquiry`,
          message: formData.message,
          country: 'Global / Online',
          preferredContact: formData.preferredContact,
          hp_field: formData.hp_field
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedInquiryId(data.inquiryId || '');
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to submit message.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Unable to connect to server. Please reach out directly on WhatsApp.');
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DIRECT ENTERPRISE CONSULTATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          CONNECT WITH AHSAN AI LABS
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Speak directly with our AI architects to discuss your technical requirements, request a custom proposal, or ask questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Col: Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-5 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold font-heading text-white">
              Direct Communication Channels
            </h3>

            <div className="space-y-4">
              {/* WhatsApp Card */}
              <a 
                href={`https://wa.me/${settings?.whatsappDirectNumber || '923316041183'}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-700/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Official WhatsApp
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {settings?.supportWhatsApp || '+92 331 6041183'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Instant response for priority inquiries & enterprise chats.
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a 
                href={`mailto:${settings?.primaryEmail || 'contact@ahsanailabs.com'}`}
                className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-700/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/40 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Enterprise Email
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {settings?.primaryEmail || 'contact@ahsanailabs.com'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Direct architectural reviews and formal requests for proposal.
                  </div>
                </div>
              </a>

              {/* Global Coverage Card */}
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Global Engineering Labs
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Worldwide Client Deployments
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Operating across Americas, EMEA, and Asia-Pacific timezones.
                  </div>
                </div>
              </div>

              {/* Official Social Media Links */}
              {Boolean(
                (settings?.socialLinks?.linkedin && settings?.socialLinksEnabled?.linkedin !== false) ||
                (settings?.socialLinks?.twitter && settings?.socialLinksEnabled?.twitter !== false) ||
                (settings?.socialLinks?.instagram && settings?.socialLinksEnabled?.instagram !== false) ||
                (settings?.socialLinks?.youtube && settings?.socialLinksEnabled?.youtube !== false) ||
                (settings?.socialLinks?.facebook && settings?.socialLinksEnabled?.facebook !== false) ||
                (settings?.socialLinks?.github && settings?.socialLinksEnabled?.github !== false)
              ) && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Connect On Official Social Channels:
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {settings?.socialLinks?.linkedin && settings?.socialLinksEnabled?.linkedin !== false && (
                      <a
                        href={settings.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-blue-500 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {settings?.socialLinks?.twitter && settings?.socialLinksEnabled?.twitter !== false && (
                      <a
                        href={settings.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-blue-400 transition-colors"
                      >
                        X (Twitter)
                      </a>
                    )}
                    {settings?.socialLinks?.instagram && settings?.socialLinksEnabled?.instagram !== false && (
                      <a
                        href={settings.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-pink-500 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {settings?.socialLinks?.youtube && settings?.socialLinksEnabled?.youtube !== false && (
                      <a
                        href={settings.socialLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-red-500 transition-colors"
                      >
                        YouTube
                      </a>
                    )}
                    {settings?.socialLinks?.facebook && settings?.socialLinksEnabled?.facebook !== false && (
                      <a
                        href={settings.socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-blue-600 transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {settings?.socialLinks?.github && settings?.socialLinksEnabled?.github !== false && (
                      <a
                        href={settings.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-purple-500 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick project order nudge */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 space-y-3">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Need Complete Project Scope?
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you have specific budget, timeline, and workflow requirements, use our dedicated Get Started order builder for an instant Inquiry ID.
            </p>
            <button
              onClick={() => onNavigate('/get-started')}
              className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors shadow-md shadow-blue-600/30"
            >
              <span>Go to Get Started Form</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>

        </div>

        {/* Right Col: Simple Consultation Form */}
        <div className="lg:col-span-7">
          <div className="p-5 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold font-heading text-white mb-2">
              Send a Message
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill out the form below. We will review your query and reply via your preferred contact channel.
            </p>

            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-blue-950/50 border border-cyan-500/40 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold font-heading text-white">
                  Message Sent Successfully!
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 max-w-md mx-auto">
                  <div>
                    <span className="text-slate-400">Reference ID: </span>
                    <span className="font-mono font-bold text-cyan-400">{submittedInquiryId || 'AHSAN-2026-CONFIRMED'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Thank you for contacting <b>AHSAN AI LABS</b>. Our team has received your message and will reach out to you shortly via <b>{formData.preferredContact}</b>.
                  </p>
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${settings?.whatsappDirectNumber || '923316041183'}?text=${encodeURIComponent(`Hello Ahsan AI Labs team, I just submitted a message on the contact form with Reference ID ${submittedInquiryId}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-600/30 space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp Now</span>
                  </a>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({ 
                        name: '', 
                        email: '', 
                        whatsapp: '', 
                        company: '', 
                        service: 'AI Voice Agents',
                        subject: '',
                        message: '',
                        preferredContact: 'WhatsApp',
                        hp_field: ''
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from humans) */}
                <input
                  type="text"
                  name="hp_field"
                  value={formData.hp_field}
                  onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {status === 'error' && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Health Group"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">WhatsApp / Phone Number</label>
                    <input
                      type="text"
                      placeholder="+92 300 1234567"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">Service of Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                    >
                      <option value="AI Voice Agents">AI Voice Agents</option>
                      <option value="Business Automation">Business Automation</option>
                      <option value="AI Chatbots">AI Chatbots & Assistants</option>
                      <option value="AI Agents">Autonomous AI Agents</option>
                      <option value="Enterprise AI Solutions">Enterprise AI Systems</option>
                      <option value="Other Consultation">Other Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-medium text-slate-300">Preferred Contact Channel</label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                    >
                      <option value="WhatsApp">WhatsApp (Fastest)</option>
                      <option value="Email">Email</option>
                      <option value="Phone Call">Direct Phone Call</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-300">Subject (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Inquiring about inbound voice bot for clinic booking"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-300">How can we assist you? *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe what AI, voice agent, or automation system you want to build or discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 text-xs sm:text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
                >
                  {status === 'submitting' ? (
                    <span>Processing Submission...</span>
                  ) : (
                    <>
                      <span>Send Consultation Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Your information is strictly confidential & protected under NDA standards.</span>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

