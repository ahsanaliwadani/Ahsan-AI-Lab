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
  HelpCircle,
  AlertCircle,
  Lock,
  Award,
  Check,
  Smartphone,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Building2,
  Copy,
  CheckCheck
} from 'lucide-react';
import { SiteSettings } from '../types';
import { 
  sanitizePhoneNumber, 
  handlePhoneKeyDown, 
  validatePhoneNumber, 
  validateEmail, 
  validateName, 
  validateMessage 
} from '../utils/formValidation';

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
    timeline: 'Within 2-4 Weeks',
    subject: '',
    message: '',
    preferredContact: 'WhatsApp',
    hp_field: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedInquiryId, setSubmittedInquiryId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const validate = () => {
    const errs: Record<string, string> = {};

    const nameCheck = validateName(formData.name, 'Full Name');
    if (!nameCheck.isValid && nameCheck.error) errs.name = nameCheck.error;

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid && emailCheck.error) errs.email = emailCheck.error;

    const isPhoneRequired = formData.preferredContact === 'WhatsApp' || formData.preferredContact === 'Phone Call';
    const phoneCheck = validatePhoneNumber(formData.whatsapp, isPhoneRequired);
    if (!phoneCheck.isValid && phoneCheck.error) {
      errs.whatsapp = isPhoneRequired && !formData.whatsapp.trim()
        ? `Phone / WhatsApp number is required when selecting ${formData.preferredContact}`
        : phoneCheck.error;
    }

    const messageCheck = validateMessage(formData.message, 'Message', 10);
    if (!messageCheck.isValid && messageCheck.error) errs.message = messageCheck.error;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopyEmail = () => {
    const emailToCopy = settings?.primaryEmail || 'contact@ahsanailabs.com';
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus('error');
      setErrorMessage('Please review the highlighted fields below before submitting.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          companyName: formData.company || 'Direct Contact',
          email: formData.email,
          whatsapp: formData.whatsapp || 'Not provided',
          service: formData.service,
          subject: formData.subject || `${formData.service} Inquiry (${formData.timeline})`,
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

  const contactFaqs = [
    {
      q: 'How fast will an AI Systems Architect review my inquiry?',
      a: 'We respond to WhatsApp inquiries typically within 15 to 45 minutes during business hours, and within 2 to 4 hours globally. Formal email inquiries receive a complete technical response within 12 hours.'
    },
    {
      q: 'Can our legal team execute our corporate NDA before sharing internal details?',
      a: 'Yes, absolutely. We welcome executing your standard company mutual Non-Disclosure Agreement (NDA) or we can provide our standard enterprise NDA upfront before reviewing private databases or schemas.'
    },
    {
      q: 'Can we schedule a live screen-share demonstration of your voice agents?',
      a: 'Yes! After your initial inquiry, we can conduct a 20-minute live demonstration showing live telephony latency, CRM webhook trigger executions, and prompt interruption handling.'
    },
    {
      q: 'Do you charge for the initial architecture proposal or consultation?',
      a: 'No. The initial technical discovery and high-level architectural roadmap are completely complimentary and carry zero obligation.'
    }
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-18">
      
      {/* 1. HEADER WITH ENTERPRISE TRUST BADGES */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-cyan-950/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono uppercase tracking-wider text-[11px]">
            DIRECT ARCHITECTURAL DISCOVERY • 100% CONFIDENTIAL & NDA GUARANTEED
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
          CONNECT WITH OUR SENIOR AI ARCHITECTS
        </h1>
        
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Discuss your operational bottlenecks, customer telephony channels, or automation workflows directly with our engineering team. We deliver custom architecture proposals with locked milestone pricing.
        </p>

        {/* 4 Trust Badges Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>100% Mutual NDA Guaranteed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>&lt; 2-Hour WhatsApp Turnaround</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Free Architecture Roadmap</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Zero Spam &amp; Zero Lock-in</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID: LEFT DIRECT CONTACT & RIGHT CONSULTATION FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* LEFT COLUMN: DIRECT CHANNELS & SENIOR ARCHITECT CARD */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Senior Architect Direct Access Profile Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-950/70 via-slate-900/90 to-cyan-950/70 border border-cyan-500/35 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-heading font-extrabold text-white text-lg shadow-md shadow-cyan-500/30">
                    AA
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" title="Online" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Ahsan Ali</span>
                    <BadgeCheckIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xs text-cyan-300 font-mono">
                    Founder &amp; Principal AI Architect
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AVAILABLE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "When you reach out to Ahsan AI Labs, you connect directly with the engineers building your systems—not junior sales reps or account managers. We audit your workflows with absolute engineering precision."
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Verified Systems: 50+</span>
              <span>Global SLA: 99.98%</span>
            </div>
          </div>

          {/* Primary Communication Channels */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>DIRECT EXECUTIVE CHANNELS</span>
            </div>

            {/* WhatsApp Priority Channel */}
            <a 
              href={`https://wa.me/${settings?.whatsappDirectNumber || '923316041183'}?text=${encodeURIComponent('Hello Ahsan AI Labs team, I would like to schedule an enterprise AI consultation.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all duration-200 group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Official WhatsApp
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Fastest Response
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">
                  {settings?.supportWhatsApp || '+92 331 6041183'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Direct WhatsApp chat with senior architects. Typical response &lt; 15 mins.
                </div>
              </div>
            </a>

            {/* Email Channel with Copy Helper */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-600/40 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Enterprise Email
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 font-mono">
                      {settings?.primaryEmail || 'contact@ahsanailabs.com'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                  title="Copy email address"
                >
                  {copiedEmail ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[11px] text-slate-400 pl-1">
                For formal Requests for Proposals (RFPs), enterprise security questionnaires, and NDA reviews.
              </div>
            </div>

            {/* Global Engineering Operations */}
            <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-600/40 text-cyan-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Global Engineering Hubs
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Worldwide Deployment Coverage
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Supporting clients across Americas, EMEA, and Asia-Pacific time zones.
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              OUR CONSULTATION PROCESS
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <span className="font-mono text-cyan-400 font-bold shrink-0">01.</span>
                <span><b>Technical Review:</b> Direct review of your inquiry within 2 hours.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-mono text-cyan-400 font-bold shrink-0">02.</span>
                <span><b>Mutual NDA:</b> Signed upfront to safeguard trade secrets &amp; schemas.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-mono text-cyan-400 font-bold shrink-0">03.</span>
                <span><b>Architecture Blueprint:</b> Concrete roadmap with locked milestone pricing.</span>
              </div>
            </div>
          </div>

          {/* Quick Get Started CTA */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-950 border border-blue-800/50 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">Have a specific project scope?</div>
              <div className="text-[11px] text-slate-400">Use our multi-step order builder for an instant ID.</div>
            </div>
            <button
              onClick={() => onNavigate('/get-started')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shrink-0 shadow-md shadow-blue-600/30"
            >
              Order Builder →
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH-CONVERTING CONSULTATION FORM */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Send a Consultation Inquiry
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete the technical brief below. All submissions are encrypted and NDA-protected.
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            {status === 'success' ? (
              <div className="py-10 px-6 rounded-2xl bg-blue-950/50 border border-cyan-500/40 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold font-heading text-white">
                    Inquiry Received Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Our Principal Systems Architect will review your technical brief and respond promptly.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-2.5 max-w-md mx-auto text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Tracking Reference ID:</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {submittedInquiryId || 'AHSAN-2026-CONFIRMED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Preferred Channel:</span>
                    <span className="font-semibold text-white">{formData.preferredContact}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Service Category:</span>
                    <span className="font-semibold text-cyan-300">{formData.service}</span>
                  </div>
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${settings?.whatsappDirectNumber || '923316041183'}?text=${encodeURIComponent(`Hello Ahsan AI Labs, I just submitted a consultation request for ${formData.service} with Reference ID ${submittedInquiryId}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-600/30 space-x-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open Instant WhatsApp Thread</span>
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
                        timeline: 'Within 2-4 Weeks',
                        subject: '',
                        message: '',
                        preferredContact: 'WhatsApp',
                        hp_field: ''
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Submit Another Inquiry
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
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Full Name <span className="text-cyan-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) {
                          const check = validateName(e.target.value, 'Full Name');
                          if (check.isValid) setErrors(prev => ({ ...prev, name: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 text-xs sm:text-sm transition-colors ${
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-300">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Health & Logistics"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Email & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-300">
                      Business Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        const cleanEmail = e.target.value.trim();
                        setFormData({ ...formData, email: cleanEmail });
                        if (errors.email) {
                          const check = validateEmail(cleanEmail);
                          if (check.isValid) setErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 text-xs sm:text-sm transition-colors ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        WhatsApp / Phone {formData.preferredContact !== 'Email' && <span className="text-cyan-400">*</span>}
                      </label>
                      {formData.whatsapp && (
                        <span className={`text-[10px] font-mono ${
                          (formData.whatsapp.match(/\d/g) || []).length >= 7 && (formData.whatsapp.match(/\d/g) || []).length <= 15
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400'
                        }`}>
                          {(formData.whatsapp.match(/\d/g) || []).length}/15 digits
                        </span>
                      )}
                    </div>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={25}
                      placeholder="+92 300 1234567 or +1 (555) 234-5678"
                      value={formData.whatsapp}
                      onKeyDown={handlePhoneKeyDown}
                      onChange={(e) => {
                        const sanitized = sanitizePhoneNumber(e.target.value);
                        setFormData({ ...formData, whatsapp: sanitized });
                        if (errors.whatsapp) {
                          const isPhoneRequired = formData.preferredContact === 'WhatsApp' || formData.preferredContact === 'Phone Call';
                          const check = validatePhoneNumber(sanitized, isPhoneRequired);
                          if (check.isValid) setErrors(prev => ({ ...prev, whatsapp: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 text-xs sm:text-sm font-mono tracking-wide transition-colors ${
                        errors.whatsapp ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                    {errors.whatsapp ? (
                      <p className="text-[11px] text-red-400 flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {errors.whatsapp}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-500">
                        Numbers &amp; country code only.
                      </p>
                    )}
                  </div>
                </div>

                {/* Service of Interest & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-300">Service of Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs sm:text-sm"
                    >
                      <option value="AI Voice Agents">AI Voice Agents (Telephony &amp; Reception)</option>
                      <option value="WhatsApp Automation">WhatsApp Cloud API Automation</option>
                      <option value="AI Chatbots">AI Chatbots &amp; Omnichannel Assistants</option>
                      <option value="AI Agents">Autonomous AI Agents &amp; ReAct Workflows</option>
                      <option value="Business Automation">Business Pipeline &amp; Webhook Automation</option>
                      <option value="Enterprise AI Solutions">Custom Enterprise AI Architecture</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-300">Target Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs sm:text-sm"
                    >
                      <option value="Immediate Sprint (1-2 Weeks)">Immediate Sprint (1-2 Weeks)</option>
                      <option value="Within 2-4 Weeks">Within 2-4 Weeks</option>
                      <option value="Next 1-2 Months">Next 1-2 Months</option>
                      <option value="Exploratory Architecture Review">Exploratory Architecture Review</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Contact Channel */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-300">
                    How should we reply to you?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'WhatsApp', label: 'WhatsApp (Fastest)' },
                      { id: 'Email', label: 'Email' },
                      { id: 'Phone Call', label: 'Phone Call' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredContact: opt.id })}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                          formData.preferredContact === opt.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-300">Subject (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Inquiring about low-latency voice bot for clinical scheduling"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-xs sm:text-sm"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Technical Requirements or Business Goal <span className="text-cyan-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formData.message.trim().length} chars (min 10)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Describe your current manual workflow, desired AI solution, existing CRM/APIs, or expected inquiry volume..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) {
                        const check = validateMessage(e.target.value, 'Message', 10);
                        if (check.isValid) setErrors(prev => ({ ...prev, message: '' }));
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 text-xs sm:text-sm resize-none transition-colors ${
                      errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-400 flex items-center mt-1">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50 flex items-center justify-center space-x-2 active:scale-[0.98]"
                >
                  {status === 'submitting' ? (
                    <span>Encrypting &amp; Submitting Brief...</span>
                  ) : (
                    <>
                      <span>Send Consultation Brief</span>
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-slate-400 flex items-center justify-center space-x-2 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your submission is confidential, protected under mutual NDA standards, and never shared.</span>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* 3. CONTACT & CONSULTATION FAQS ACCORDION */}
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            TRANSPARENT ENGAGEMENT
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Frequently Asked Consultation Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear guidelines on response SLAs, NDA agreements, and our consultation protocols.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {contactFaqs.map((faq, idx) => {
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
                  <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 text-slate-400">
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

    </div>
  );
};

// Helper badge icon
const BadgeCheckIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);
