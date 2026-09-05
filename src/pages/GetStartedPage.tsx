import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Bot, 
  Mic, 
  MessageSquare, 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { ServiceType, ContactMethod, Inquiry } from '../types';
import { trackEvent } from '../utils/analytics';
import { 
  sanitizePhoneNumber, 
  handlePhoneKeyDown, 
  validatePhoneNumber, 
  validateEmail, 
  validateName, 
  validateCompany, 
  validateMessage 
} from '../utils/formValidation';

interface GetStartedPageProps {
  initialService?: string;
  onNavigate: (path: string) => void;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({
  initialService,
  onNavigate
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    whatsapp: '',
    country: '',
    service: (initialService as ServiceType) || 'AI Agents',
    industry: '',
    businessDescription: '',
    problem: '',
    requirements: '',
    timeline: 'Within 2-4 Weeks',
    budget: '$5,000 - $10,000',
    preferredContact: 'WhatsApp' as ContactMethod,
    hp_field: '' // Honeypot field (must stay blank)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<Inquiry | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    trackEvent('inquiry_form_started', 'FORM_START', { initialService });
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService as ServiceType }));
    }
  }, [initialService]);

  const serviceOptions: { label: ServiceType; icon: React.ReactNode; desc: string }[] = [
    { label: 'AI Agents', icon: <Bot className="w-4 h-4 text-blue-400" />, desc: 'Autonomous multi-step reasoning & task execution' },
    { label: 'AI Voice Agents', icon: <Mic className="w-4 h-4 text-cyan-400" />, desc: 'Inbound & outbound conversational phone assistants' },
    { label: 'AI Chatbots', icon: <MessageSquare className="w-4 h-4 text-blue-400" />, desc: 'Knowledge-grounded website lead generation & support' },
    { label: 'Business Automation', icon: <Zap className="w-4 h-4 text-amber-400" />, desc: 'End-to-end CRM, ERP, invoice, and API pipelines' },
    { label: 'WhatsApp Automation', icon: <Smartphone className="w-4 h-4 text-emerald-400" />, desc: 'Official Cloud API booking & conversational funnels' }
  ];

  const timelineOptions = [
    'Immediately (1-2 Weeks)',
    'Within 2-4 Weeks',
    'Within 1-2 Months',
    'Planning / Exploratory Phase'
  ];

  const budgetOptions = [
    'Under $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+',
    'Undetermined / Flexible'
  ];

  const contactMethodOptions: { label: ContactMethod; icon: React.ReactNode }[] = [
    { label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4 text-emerald-400" /> },
    { label: 'Email', icon: <Send className="w-4 h-4 text-blue-400" /> },
    { label: 'Phone Call', icon: <Mic className="w-4 h-4 text-cyan-400" /> }
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    const nameCheck = validateName(formData.fullName, 'Full Name');
    if (!nameCheck.isValid && nameCheck.error) errs.fullName = nameCheck.error;

    const companyCheck = validateCompany(formData.companyName, true);
    if (!companyCheck.isValid && companyCheck.error) errs.companyName = companyCheck.error;

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid && emailCheck.error) errs.email = emailCheck.error;

    const phoneCheck = validatePhoneNumber(formData.whatsapp, true);
    if (!phoneCheck.isValid && phoneCheck.error) errs.whatsapp = phoneCheck.error;

    const countryCheck = validateName(formData.country, 'Country / Location');
    if (!countryCheck.isValid && countryCheck.error) errs.country = countryCheck.error;

    const problemCheck = validateMessage(formData.problem, 'Problem description', 10);
    if (!problemCheck.isValid && problemCheck.error) errs.problem = problemCheck.error;

    const reqCheck = validateMessage(formData.requirements, 'System requirements', 10);
    if (!reqCheck.isValid && reqCheck.error) errs.requirements = reqCheck.error;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmittedInquiry(result.inquiry);
        trackEvent('form_submitted', 'FORM_SUBMIT', {
          service: result.inquiry.service,
          inquiryId: result.inquiry.inquiryId
        });
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas blocked
        }
        window.scrollTo({ top: 150, behavior: 'smooth' });
      } else {
        setErrors({ submit: result.message || 'Submission failed. Please check your inputs.' });
      }
    } catch (err: any) {
      setErrors({ submit: 'Network error or server unreachable. Please try again or reach out on WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInquiryId = () => {
    if (!submittedInquiry) return;
    navigator.clipboard.writeText(submittedInquiry.inquiryId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Banner */}
      {!submittedInquiry && (
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>START YOUR ENTERPRISE PROJECT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
            REQUEST A CUSTOM AI SYSTEM
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Provide your business context and operational requirements below. Our engineering team reviews all submissions within 4 to 24 business hours.
          </p>
        </div>
      )}

      {/* SUCCESS STATE VIEW */}
      {submittedInquiry ? (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-blue-700/60 shadow-2xl space-y-6 text-center">
            
            <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                INQUIRY SUCCESSFULLY REGISTERED
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Thank you for contacting AHSAN AI LABS!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                We have successfully received your request for <strong className="text-white">{submittedInquiry.service}</strong>.
              </p>
            </div>

            {/* Generated Unique Inquiry ID Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-blue-900/60 flex items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Tracking ID:</div>
                <div className="text-lg font-mono font-bold text-cyan-400">{submittedInquiry.inquiryId}</div>
              </div>
              <button
                onClick={copyInquiryId}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center space-x-1.5 transition-colors"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated Live Automation Status Banner */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-left space-y-2.5 text-xs text-slate-300">
              <div className="font-semibold text-white flex items-center">
                <Zap className="w-4 h-4 mr-1.5 text-amber-400" />
                Automated Dispatch Telemetry
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Saved securely to Enterprise Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Automated dispatch triggered: Confirmation sent to WhatsApp ({submittedInquiry.whatsapp})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Admin engineering notification queued</span>
              </div>
            </div>

            {/* Next steps */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Receipt</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedInquiry(null);
                  setFormData({
                    fullName: '',
                    companyName: '',
                    email: '',
                    whatsapp: '',
                    country: '',
                    service: 'AI Agents',
                    industry: '',
                    businessDescription: '',
                    problem: '',
                    requirements: '',
                    timeline: 'Within 2-4 Weeks',
                    budget: '$5,000 - $10,000',
                    preferredContact: 'WhatsApp',
                    hp_field: ''
                  });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md active:scale-95"
              >
                Submit Another Project
              </button>

              <button
                onClick={() => onNavigate('/')}
                className="text-xs text-slate-400 hover:text-white py-2"
              >
                Return to Home
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* INQUIRY ORDER FORM */
        <form 
          onSubmit={handleSubmit}
          className="p-5 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6 sm:space-y-8"
        >
          {errors.submit && (
            <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Honeypot Spam Trap (Hidden from genuine users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="hp_field"
              tabIndex={-1}
              autoComplete="off"
              value={formData.hp_field}
              onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
            />
          </div>

          {/* Section 1: Choose Service */}
          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              1. Select Interested Solution *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {serviceOptions.map((opt) => {
                const isSelected = formData.service === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, service: opt.label })}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/80 border-cyan-400 ring-1 ring-cyan-400 shadow-lg shadow-blue-950/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm text-white">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-normal">
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Contact & Client Information */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              2. Contact & Organization Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) {
                      const check = validateName(e.target.value, 'Full Name');
                      if (check.isValid) setErrors(prev => ({ ...prev, fullName: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 transition-colors ${
                    errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">
                  Business / Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vance Logistics Corp"
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData({ ...formData, companyName: e.target.value });
                    if (errors.companyName) {
                      const check = validateCompany(e.target.value, true);
                      if (check.isValid) setErrors(prev => ({ ...prev, companyName: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 transition-colors ${
                    errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.companyName && (
                  <p className="text-[11px] text-red-400 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                    {errors.companyName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="marcus@vance.com"
                  value={formData.email}
                  onChange={(e) => {
                    const cleanEmail = e.target.value.trim();
                    setFormData({ ...formData, email: cleanEmail });
                    if (errors.email) {
                      const check = validateEmail(cleanEmail);
                      if (check.isValid) setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 transition-colors ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
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
                  <label className="text-xs font-medium text-slate-300">
                    WhatsApp / Phone <span className="text-red-400">*</span>
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
                  placeholder="+1 (555) 234-5678 or +92 300 1234567"
                  value={formData.whatsapp}
                  onKeyDown={handlePhoneKeyDown}
                  onChange={(e) => {
                    const sanitized = sanitizePhoneNumber(e.target.value);
                    setFormData({ ...formData, whatsapp: sanitized });
                    if (errors.whatsapp) {
                      const check = validatePhoneNumber(sanitized, true);
                      if (check.isValid) setErrors(prev => ({ ...prev, whatsapp: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 font-mono tracking-wide transition-colors ${
                    errors.whatsapp ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.whatsapp ? (
                  <p className="text-[11px] text-red-400 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                    {errors.whatsapp}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500">
                    Numbers only. Please include country code.
                  </p>
                )}
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">
                  Country / Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. United States, UAE, UK"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData({ ...formData, country: e.target.value });
                    if (errors.country) {
                      const check = validateName(e.target.value, 'Country / Location');
                      if (check.isValid) setErrors(prev => ({ ...prev, country: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 transition-colors ${
                    errors.country ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                />
                {errors.country && (
                  <p className="text-[11px] text-red-400 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                    {errors.country}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">
                  Business Type / Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Healthcare, Real Estate, E-Commerce, SaaS"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {contactMethodOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContact: opt.label })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                        formData.preferredContact === opt.label
                          ? 'bg-blue-950 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-300">
                Tell Us About Your Business (Briefly)
              </label>
              <input
                type="text"
                placeholder="What does your company do and who are your customers?"
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Requirements & Problem Statement */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              3. Operational Goals & Requirements
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  What Problem Do You Want to Solve? <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formData.problem.trim().length} chars (min 10)
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. We lose 30% of incoming leads because our sales team cannot reply after 6 PM, and our staff spends 15 hours a week copy-pasting customer details into spreadsheets."
                value={formData.problem}
                onChange={(e) => {
                  setFormData({ ...formData, problem: e.target.value });
                  if (errors.problem) {
                    const check = validateMessage(e.target.value, 'Problem description', 10);
                    if (check.isValid) setErrors(prev => ({ ...prev, problem: '' }));
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 resize-none transition-colors ${
                  errors.problem ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
                }`}
              />
              {errors.problem && (
                <p className="text-[11px] text-red-400 flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                  {errors.problem}
                </p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Describe Your System Requirements & Desired Features <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formData.requirements.trim().length} chars (min 10)
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="e.g. Need an AI Voice Agent that answers phone calls on our Twilio number, checks our Google Calendar for open slots, books appointments, and sends a WhatsApp confirmation to the caller."
                value={formData.requirements}
                onChange={(e) => {
                  setFormData({ ...formData, requirements: e.target.value });
                  if (errors.requirements) {
                    const check = validateMessage(e.target.value, 'System requirements', 10);
                    if (check.isValid) setErrors(prev => ({ ...prev, requirements: '' }));
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-xs sm:text-sm text-slate-100 resize-none transition-colors ${
                  errors.requirements ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500'
                }`}
              />
              {errors.requirements && (
                <p className="text-[11px] text-red-400 flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                  {errors.requirements}
                </p>
              )}
            </div>

            {/* Timeline & Budget Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">Expected Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-blue-500"
                >
                  {timelineOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-300">Estimated Budget (Optional)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:border-blue-500"
                >
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button & Guarantees */}
          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering Inquiry & Triggering Automations...</span>
                </>
              ) : (
                <>
                  <span>Submit Inquiry & Request Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Zero Account Creation Required
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />
                Instant WhatsApp Confirmation
              </span>
              <span>•</span>
              <span>Confidential NDA Assured</span>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};
