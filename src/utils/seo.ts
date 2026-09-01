/**
 * Dynamic SEO & Meta Tag Management for AHSAN AI LABS
 * Dynamically synchronizes document.title, meta descriptions, Open Graph, Twitter Cards,
 * and canonical links based on the active route.
 */

export interface PageMetaConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

const BASE_URL = 'https://ahsanlab.qd.je';
const DEFAULT_OG_IMAGE = 'https://ahsanlab.qd.je/og-preview.svg';
const DEFAULT_LOGO_IMAGE = 'https://ahsanlab.qd.je/logo.jpg';

export const PAGE_SEO_MAP: Record<string, PageMetaConfig> = {
  '/': {
    title: 'AHSAN AI LABS — Enterprise AI Agents, Voice Telephony & Automation',
    description: 'AHSAN AI LABS builds enterprise-grade AI agents, telephony voice assistants, custom conversational chatbots, end-to-end business automations, and official WhatsApp Cloud API systems.',
    keywords: 'AI Agents, AI Voice Agents, Autonomous Agents, AI Chatbots, Business Automation, WhatsApp Automation, AI Workflow Automation, Enterprise AI Labs, Ahsan Ali AI',
    canonicalUrl: `${BASE_URL}/`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/services': {
    title: 'Enterprise AI Services & Solutions — AHSAN AI LABS',
    description: 'Explore custom AI development services: Autonomous AI Agents, Telephony Voice Assistants, Omnichannel RAG Chatbots, Business Workflow Automation, and Meta WhatsApp Systems.',
    keywords: 'AI Services, Custom AI Development, Voice Agents, AI Chatbots, Enterprise Automation, WhatsApp Cloud API, AI Integration',
    canonicalUrl: `${BASE_URL}/services`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/demos': {
    title: 'Interactive AI Demos & Enterprise Showcases — AHSAN AI LABS',
    description: 'Watch and test live interactive demonstrations of AI voice dispatchers, customer support chatbots, automated lead qualification, and multi-agent systems.',
    keywords: 'AI Demos, Voice Bot Demos, Chatbot Showcase, AI Agent Examples, Interactive Automation Demos',
    canonicalUrl: `${BASE_URL}/demos`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/about': {
    title: 'About Us & Engineering Philosophy — AHSAN AI LABS',
    description: 'Discover the team, mission, and architecture behind AHSAN AI LABS. We engineer resilient, scalable AI infrastructure and autonomous agent systems for global enterprises.',
    keywords: 'About AHSAN AI LABS, Ahsan Ali, AI Engineering Team, Enterprise AI Mission, AI Architecture',
    canonicalUrl: `${BASE_URL}/about`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/faq': {
    title: 'Frequently Asked Questions & Support — AHSAN AI LABS',
    description: 'Find answers to common questions regarding enterprise AI deployment, telephony integrations, data privacy, security SLAs, pricing models, and turnaround times.',
    keywords: 'AI FAQ, AI Agent Pricing, Voice Agent Integration, Enterprise AI Security, WhatsApp Bot Setup',
    canonicalUrl: `${BASE_URL}/faq`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/contact': {
    title: 'Contact Us & Enterprise Consultation — AHSAN AI LABS',
    description: 'Connect directly with our senior AI engineering team for project quotes, custom architecture consultations, API integrations, and 24/7 enterprise support.',
    keywords: 'Contact AI Engineers, AI Consultation, Enterprise AI Quote, AI Development Inquiry',
    canonicalUrl: `${BASE_URL}/contact`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/get-started': {
    title: 'Get Started — Launch Your AI Project | AHSAN AI LABS',
    description: 'Initiate your custom AI implementation with AHSAN AI LABS. Define your business scope, choose integrations, and receive an actionable deployment roadmap within 24 hours.',
    keywords: 'Start AI Project, Custom AI Proposal, AI Consultation Wizard, AI Automation Setup',
    canonicalUrl: `${BASE_URL}/get-started`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  },
  '/admin': {
    title: 'Admin Console — AHSAN AI LABS Management Portal',
    description: 'Secure management portal for AHSAN AI LABS inquiries, content management, analytics, system telemetry, and server health monitoring.',
    keywords: 'Admin Console, AHSAN AI LABS Management',
    canonicalUrl: `${BASE_URL}/admin`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE
  }
};

/**
 * Updates or creates a meta tag in document head
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Updates or creates canonical link tag in document head
 */
function setCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Apply dynamic SEO meta updates based on current route path
 */
export function updatePageSEO(path: string): void {
  const isAdmin = path.startsWith('/admin');
  const normalizedPath = isAdmin ? '/admin' : (PAGE_SEO_MAP[path] ? path : '/');
  const meta = PAGE_SEO_MAP[normalizedPath] || PAGE_SEO_MAP['/'];

  // 1. Title
  document.title = meta.title;

  // 2. Standard Meta Tags
  setMetaTag('name', 'title', meta.title);
  setMetaTag('name', 'description', meta.description);
  if (meta.keywords) {
    setMetaTag('name', 'keywords', meta.keywords);
  }

  // 3. Robots Meta (Index public pages, prevent indexing of admin portal)
  if (isAdmin) {
    setMetaTag('name', 'robots', 'noindex, nofollow, noarchive');
  } else {
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  }

  // 4. Open Graph Tags
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', meta.canonicalUrl || `${BASE_URL}${path}`);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:image', meta.ogImage || DEFAULT_OG_IMAGE);

  // 5. Twitter Card Tags
  setMetaTag('property', 'twitter:title', meta.title);
  setMetaTag('property', 'twitter:description', meta.description);
  setMetaTag('property', 'twitter:url', meta.canonicalUrl || `${BASE_URL}${path}`);
  setMetaTag('property', 'twitter:image', meta.ogImage || DEFAULT_OG_IMAGE);

  // 6. Canonical Link
  setCanonicalUrl(meta.canonicalUrl || `${BASE_URL}${path}`);
}

