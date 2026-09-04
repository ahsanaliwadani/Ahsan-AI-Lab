import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { FAQItem } from '../types';

interface FAQPageProps {
  faqs: FAQItem[];
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    faq_1: true,
    faq_2: true
  });
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  React.useEffect(() => {
    document.title = "FAQ | AHSAN AI LABS — Enterprise AI & Automation Answers";
    if (faqs && faqs.length > 0) {
      let script = document.getElementById('faqpage-schema') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'faqpage-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': 'https://ahsanailab.bond/faq#faqpage',
        'url': 'https://ahsanailab.bond/faq',
        'name': 'AHSAN AI LABS Frequently Asked Questions',
        'description': 'Comprehensive answers about enterprise AI agents, telephony voice bots, chatbots, workflow automations, and official Meta WhatsApp Cloud API integrations.',
        'mainEntity': faqs.filter(f => f.published !== false).map(f => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer
          }
        }))
      };
      script.textContent = JSON.stringify(schemaData, null, 2);
    }
  }, [faqs]);

  const toggleFaq = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ['ALL', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HELP & FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
          CLEAR ANSWERS TO KEY QUESTIONS
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Everything you need to know about our AI agents, voice telephony systems, development timelines, and integration processes.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or keywords (e.g. voice agent, timeline, WhatsApp)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 placeholder-slate-500 text-sm transition-all"
          />
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            No questions matched your search criteria. Try a different keyword or contact our team directly.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq._id];
            return (
              <div
                key={faq._id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-slate-900/90 border-blue-700/60 shadow-lg shadow-blue-950/40' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-600 text-white' : 'text-slate-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Category: <strong className="text-slate-400">{faq.category}</strong></span>
                      <button
                        onClick={() => onNavigate('/get-started')}
                        className="text-blue-400 hover:text-cyan-300 font-semibold inline-flex items-center"
                      >
                        <span>Start Project</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#081120] to-slate-900 border border-blue-900/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-1 text-left">
          <h3 className="text-base sm:text-lg font-bold font-heading text-white flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-cyan-400 shrink-0" />
            Have a question not listed here?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Our engineers are available to review your exact system requirements.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => onNavigate('/contact')}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all text-center active:scale-95"
          >
            Contact Team
          </button>
          <button
            onClick={() => onNavigate('/get-started')}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 text-center active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>

    </div>
  );
};
