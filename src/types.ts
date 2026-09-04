// Types for AHSAN AI LABS Platform

export type ServiceType = 
  | 'AI Agents'
  | 'AI Voice Agents'
  | 'AI Chatbots'
  | 'Business Automation'
  | 'WhatsApp Automation';

export type ContactMethod = 'WhatsApp' | 'Email' | 'Phone Call';

export type InquiryStatus = 
  | 'NEW'
  | 'CONTACTED'
  | 'DISCUSSING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CLOSED';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';

export interface InquiryNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  type: 'N8N_WEBHOOK' | 'WHATSAPP_CUSTOMER' | 'WHATSAPP_ADMIN' | 'EMAIL_ADMIN';
  status: 'SUCCESS' | 'FAILED';
  target: string;
  timestamp: string;
  responseMessage?: string;
}

export interface Inquiry {
  _id: string;
  inquiryId: string; // e.g. AHSAN-2026-8492
  fullName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  country: string;
  service: ServiceType;
  industry: string;
  businessDescription: string;
  problem: string;
  requirements: string;
  timeline: string;
  budget?: string;
  preferredContact: ContactMethod;
  source?: 'CONTACT_PAGE' | 'GET_STARTED_PAGE' | 'MANUAL_ADMIN_ENTRY' | string;
  subject?: string;
  phone?: string;
  status: InquiryStatus;
  notificationStatus: NotificationStatus;
  notificationLogs: NotificationLog[];
  adminNotes: InquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  _id: string;
  slug: string;
  name: string;
  iconName: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  capabilities: string[];
  useCases: { title: string; desc: string; icon?: string }[];
  benefits: string[];
  demoVideoUrl?: string;
  demoVideoThumbnail?: string;
  ctaText: string;
  displayOrder: number;
  published: boolean;
  badge?: string;
}

export interface DemoItem {
  _id: string;
  title: string;
  slug: string;
  category: 'ALL' | 'AI AGENTS' | 'AI VOICE AGENTS' | 'AI CHATBOTS' | 'BUSINESS AUTOMATION' | 'WHATSAPP AUTOMATION';
  description: string;
  features: string[];
  thumbnail: string;
  videoUrl: string;
  duration: string;
  clientIndustry?: string;
  keyImpact?: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
}

export interface FounderSocialsEnabled {
  linkedin?: boolean;
  twitter?: boolean;
  github?: boolean;
  email?: boolean;
  whatsapp?: boolean;
}

export interface FounderInfo {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  quote: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
    whatsapp?: string;
  };
  socialsEnabled?: FounderSocialsEnabled;
}

export interface CompanyContent {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  founder: FounderInfo;
  about: {
    mission: string;
    vision: string;
    companyDescription: string;
    pillars: { title: string; desc: string }[];
    processSteps: { step: string; title: string; description: string }[];
  };
  metrics: {
    label: string;
    value: string;
    suffix?: string;
  }[];
}

export interface SocialLinksEnabled {
  linkedin?: boolean;
  twitter?: boolean;
  instagram?: boolean;
  youtube?: boolean;
  facebook?: boolean;
  github?: boolean;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  logoText: string;
  siteUrl?: string;
  primaryEmail: string;
  supportWhatsApp: string;
  whatsappDirectNumber: string;
  address: string;
  officeHours: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
    facebook: string;
    github?: string;
  };
  socialLinksEnabled?: SocialLinksEnabled;
  n8nWebhookUrl: string;
  n8nContactWebhookUrl?: string;
  n8nOrderWebhookUrl?: string;
  n8nWebhookSecret: string;
  n8nEnabled: boolean;
  n8nContactEnabled?: boolean;
  n8nOrderEnabled?: boolean;
  emailNotificationsEnabled: boolean;
  whatsappNotificationsEnabled: boolean;
  analyticsEnabled?: boolean;
  alertsEmail?: string;
  alertsWhatsApp?: string;
  alertCpuThreshold?: number;
  alertRamThreshold?: number;
  alertDiskThreshold?: number;
}

export interface AuditLog {
  _id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SUPPORT';
  lastLogin?: string;
}

// --- ANALYTICS & CONVERSION TYPES ---

export type TrafficSource = 'Direct' | 'Organic Search' | 'LinkedIn' | 'Twitter/X' | 'WhatsApp' | 'GitHub' | 'Referral' | 'Social' | 'Other';

export interface AnalyticsEvent {
  _id: string;
  sessionId: string;
  visitorId: string;
  eventType: 'PAGE_VIEW' | 'CLICK' | 'FORM_START' | 'FORM_SUBMIT' | 'DEMO_VIEW' | 'SERVICE_VIEW' | 'CUSTOM';
  eventName: string;
  path: string;
  referrer?: string;
  trafficSource: TrafficSource;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  country?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsSummary {
  timeRange: 'today' | '7d' | '30d' | 'custom';
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  topPages: { path: string; views: number; uniqueVisitors: number }[];
  topServices: { service: string; views: number }[];
  trafficSources: { source: string; count: number; percentage: number }[];
  referralSources: { referrer: string; count: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  browserDistribution: { browser: string; count: number; percentage: number }[];
  countryDistribution: { country: string; count: number }[];
  timeline: { date: string; visitors: number; pageViews: number; conversions: number }[];
  conversionFunnel: {
    visitors: number;
    serviceViews: number;
    formStarts: number;
    formSubmits: number;
    serviceViewRate: number;
    formStartRate: number;
    completionRate: number;
    overallConversionRate: number;
  };
  keyEvents: { eventName: string; label: string; count: number }[];
}

// --- PERFORMANCE & CORE WEB VITALS TYPES ---

export interface WebVitalMetric {
  _id: string;
  name: 'LCP' | 'FID' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  path: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  timestamp: string;
}

export interface PerformanceDashboardData {
  overallScore: 'EXCELLENT' | 'NEEDS_ATTENTION' | 'POOR';
  scoreValue: number;
  avgResponseTimeMs: number;
  p95ResponseTimeMs: number;
  errorRatePercent: number;
  totalRequests24h: number;
  webVitals: {
    lcp: { avg: number; rating: 'good' | 'needs-improvement' | 'poor'; p75: number };
    fcp: { avg: number; rating: 'good' | 'needs-improvement' | 'poor'; p75: number };
    cls: { avg: number; rating: 'good' | 'needs-improvement' | 'poor'; p75: number };
    fid: { avg: number; rating: 'good' | 'needs-improvement' | 'poor'; p75: number };
    ttfb: { avg: number; rating: 'good' | 'needs-improvement' | 'poor'; p75: number };
  };
  slowEndpoints: { endpoint: string; method: string; avgDurationMs: number; callsCount: number }[];
  latencyTrend: { time: string; avgLatencyMs: number; requests: number }[];
}

// --- SERVER & SYSTEM MONITORING TYPES ---

export interface ServiceStatusItem {
  name: string;
  category: 'APPLICATION' | 'DATABASE' | 'REVERSE_PROXY' | 'PROCESS_MANAGER' | 'AUTOMATION';
  status: 'RUNNING' | 'WARNING' | 'DOWN';
  latencyMs?: number;
  details: string;
  lastChecked: string;
}

export interface ServerMetrics {
  cpuUsagePercent: number;
  cpuCores: number;
  ramUsedMb: number;
  ramTotalMb: number;
  ramFreeMb: number;
  ramUsagePercent: number;
  diskUsedGb: number;
  diskTotalGb: number;
  diskFreeGb: number;
  diskUsagePercent: number;
  loadAverage: [number, number, number];
  uptimeSeconds: number;
  uptimeFormatted: string;
  processMemoryMb: number;
  nodeVersion: string;
  platform: string;
}

export interface DatabaseMetrics {
  status: 'CONNECTED' | 'LOCAL_FALLBACK' | 'ERROR';
  engine: string;
  connectedClients: number;
  collectionsCount: number;
  totalDocuments: number;
  storageSizeMb: number;
  avgQueryLatencyMs: number;
  collections: { name: string; count: number; sizeKb: number }[];
}

export interface UptimeCheckLog {
  id: string;
  timestamp: string;
  status: 'HEALTHY' | 'WARNING' | 'DOWN';
  httpStatusCode: number;
  responseTimeMs: number;
  target: string;
}

export interface UptimeSummary {
  uptimePercentage30d: number;
  currentStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastDowntime: string | null;
  totalIncidents30d: number;
  recentChecks: UptimeCheckLog[];
  incidents: {
    id: string;
    startTime: string;
    endTime?: string;
    duration: string;
    reason: string;
    severity: 'CRITICAL' | 'WARNING';
    resolved: boolean;
  }[];
}

// --- ERROR & AUTOMATION MONITORING TYPES ---

export interface ErrorLogItem {
  _id: string;
  title: string;
  message: string;
  stack?: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  component: 'BACKEND_API' | 'DATABASE' | 'CLIENT_APP' | 'AUTOMATION_WEBHOOK' | 'SERVER';
  statusCode?: number;
  path?: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'UNRESOLVED' | 'INVESTIGATING' | 'RESOLVED';
}

export interface AutomationMetrics {
  webhookUrl: string;
  webhookEnabled: boolean;
  totalWebhooksSent: number;
  successCount: number;
  failedCount: number;
  successRatePercent: number;
  pendingNotifications: number;
  recentDeliveries: {
    id: string;
    inquiryId: string;
    clientName: string;
    type: string;
    status: 'SUCCESS' | 'FAILED';
    responseMessage?: string;
    timestamp: string;
  }[];
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  triggerType: 'UPTIME' | 'CPU' | 'RAM' | 'DISK' | 'DATABASE' | 'ERROR_SPIKE' | 'AUTOMATION';
  timestamp: string;
  dispatchedEmail: boolean;
  dispatchedWhatsApp: boolean;
  acknowledged: boolean;
}

