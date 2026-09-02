import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { AutomationEngine } from './server/automation';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.ADMIN_SECRET || process.env.JWT_SECRET || 'ahsan_ai_labs_super_secure_jwt_secret_key_2026';

// 1. High-Performance Gzip/Brotli Compression
app.use(compression({
  threshold: 1024, // only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// 2. Comprehensive Enterprise Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://*.cloudflareinsights.com https://*.cloudflare.com https://www.youtube.com https://s.ytimg.com https://www.google.com https://www.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https: blob:",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://*.cloudflareinsights.com https://*.cloudflare.com https://www.youtube.com https://s.ytimg.com https://www.google.com https://www.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https:",
      "img-src 'self' data: blob: https: https://images.unsplash.com https://images.pexels.com https://*.cloudflare.com",
      "connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com https://*.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https: wss: ws:",
      "font-src 'self' data: https://fonts.gstatic.com https:",
      "media-src 'self' https: data: blob:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.loom.com https:",
      "worker-src 'self' blob:"
    ].join('; ')
  );

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Prevent caching of private API requests
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
});

// 3. Body Parser with 100mb payload limit for high-definition video uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// 4. Static public folder with smart caching (1 day for media assets)
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir, {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// 5. In-memory rate limiter for public inquiry submissions
const submissionRateMap = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_MIN = 5;

const inquiryRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = submissionRateMap.get(ip);

  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    submissionRateMap.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  if (entry.count >= MAX_SUBMISSIONS_PER_MIN) {
    return res.status(429).json({
      success: false,
      message: 'Too many submissions from this connection. Please wait a minute before trying again.'
    });
  }

  entry.count += 1;
  next();
};

// 6. Dedicated Admin Login Brute-Force Protection Rate Limiter
const loginAttemptsMap = new Map<string, { attempts: number; lockUntil: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

const loginBruteForceProtector = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttemptsMap.get(ip);

  if (record && record.lockUntil > now) {
    const remainingMins = Math.ceil((record.lockUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Account protection active. Too many failed attempts. Please try again in ${remainingMins} minute${remainingMins > 1 ? 's' : ''}.`
    });
  }

  next();
};

// Latency and Performance Telemetry Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.path.startsWith('/api') && !req.path.startsWith('/api/admin/system-health') && !req.path.startsWith('/api/admin/uptime')) {
      const durationMs = Date.now() - start;
      db.logApiLatency({
        path: req.path,
        method: req.method,
        statusCode: res.statusCode,
        durationMs,
        timestamp: new Date().toISOString(),
        isSlow: durationMs > 300
      });
    }
  });
  next();
});

// Serve uploaded media (videos, thumbnails) with streaming support
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads'), {
  acceptRanges: true,
  maxAge: '1d'
}));

// Admin Authentication Middleware
export interface AuthenticatedRequest extends Request {
  adminUser?: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Access token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired session' });
  }
};

// ==========================================
// PUBLIC API & SEO ROUTES
// ==========================================

// GET /sitemap.xml (Dynamic Search Engine Sitemap with standard protocol schema)
app.get('/sitemap.xml', (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://ahsanailab.bond/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ahsanailab.bond/services</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ahsanailab.bond/demos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ahsanailab.bond/get-started</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ahsanailab.bond/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ahsanailab.bond/faq</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ahsanailab.bond/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.status(200).send(sitemapXml);
  } catch (err: any) {
    res.status(500).send('Error generating sitemap');
  }
});

// GET /robots.txt (Crawler Directive Engine)
app.get('/robots.txt', (req: Request, res: Response) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/analytics/

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /api/admin/

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: https://ahsanailab.bond/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(robotsTxt);
});

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  const server = db.getServerMetrics();
  const mongo = db.getMongoStatus();
  const isHealthy = server.cpuUsagePercent < 95 && server.ramUsagePercent < 95;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'HEALTHY' : 'WARNING',
    system: 'AHSAN AI LABS Enterprise Platform',
    environment: process.env.NODE_ENV || 'production',
    uptimeSeconds: server.uptimeSeconds,
    uptimeFormatted: server.uptimeFormatted,
    checks: {
      webApplication: 'HEALTHY',
      database: mongo.connected ? 'HEALTHY' : 'LOCAL_FALLBACK',
      systemResources: isHealthy ? 'HEALTHY' : 'HIGH_LOAD'
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/ready
app.get('/api/ready', (req: Request, res: Response) => {
  const mongoStatus = db.getMongoStatus();
  res.json({
    ready: true,
    storage: mongoStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
  });
});

// POST /api/analytics/event (Privacy-conscious public telemetry ingestion)
app.post('/api/analytics/event', (req: Request, res: Response) => {
  try {
    const { eventName, eventType, path, referrer, metadata, visitorId, sessionId, deviceType, browser, os, country } = req.body;
    if (!eventName || !path) {
      return res.status(400).json({ success: false, message: 'Missing event payload fields' });
    }

    // Extract headers for fallback metadata if not provided client-side
    const ua = req.headers['user-agent'] || '';
    let resolvedDevice = deviceType;
    if (!resolvedDevice) {
      resolvedDevice = /mobile/i.test(ua) ? 'Mobile' : (/tablet|ipad/i.test(ua) ? 'Tablet' : 'Desktop');
    }

    let trafficSource: 'Direct' | 'Organic Search' | 'Social' | 'Referral' | 'Campaign' = 'Direct';
    if (referrer) {
      const refLower = referrer.toLowerCase();
      if (refLower.includes('google') || refLower.includes('bing') || refLower.includes('duckduckgo')) {
        trafficSource = 'Organic Search';
      } else if (refLower.includes('facebook') || refLower.includes('twitter') || refLower.includes('linkedin') || refLower.includes('instagram') || refLower.includes('t.co')) {
        trafficSource = 'Social';
      } else {
        trafficSource = 'Referral';
      }
    }

    const event = db.logAnalyticsEvent({
      visitorId: visitorId || 'anon_' + Math.random().toString(36).substr(2, 9),
      sessionId: sessionId || 'sess_' + Math.random().toString(36).substr(2, 9),
      eventType: eventType || 'PAGE_VIEW',
      eventName,
      path,
      referrer: referrer || undefined,
      trafficSource,
      deviceType: resolvedDevice || 'Desktop',
      browser: browser || (ua.includes('Chrome') ? 'Chrome' : (ua.includes('Safari') ? 'Safari' : (ua.includes('Firefox') ? 'Firefox' : 'Other'))),
      os: os || (ua.includes('Win') ? 'Windows' : (ua.includes('Mac') ? 'macOS' : (ua.includes('Android') ? 'Android' : (ua.includes('iOS') ? 'iOS' : 'Linux')))),
      country: country || 'United States',
      metadata
    });

    res.json({ success: true, eventId: event._id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error recording analytics' });
  }
});

// POST /api/analytics/performance (Web Vitals ingestion)
app.post('/api/analytics/performance', (req: Request, res: Response) => {
  try {
    const { name, value, rating, path, deviceType } = req.body;
    if (!name || value === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid metric payload' });
    }

    const metric = db.logWebVital({
      name,
      value: Number(value),
      rating: rating || (value < 2.5 ? 'good' : 'needs-improvement'),
      path: path || '/',
      deviceType: deviceType || 'Desktop'
    });

    res.json({ success: true, metricId: metric._id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error recording web vital' });
  }
});

// POST /api/analytics/error (Client error logger)
app.post('/api/analytics/error', (req: Request, res: Response) => {
  try {
    const { title, message, stack, component, path, statusCode } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Missing error title or message' });
    }

    const logged = db.logError({
      title: String(title).slice(0, 150),
      message: String(message).slice(0, 500),
      stack: stack ? String(stack).slice(0, 1000) : undefined,
      component: component || 'CLIENT_APP',
      path: path || undefined,
      statusCode: statusCode ? Number(statusCode) : undefined,
      severity: 'WARNING'
    });

    res.json({ success: true, errorId: logged._id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error logging client error' });
  }
});

// GET /api/public/content
app.get('/api/public/content', (req: Request, res: Response) => {
  try {
    const services = db.getServices(true);
    const demos = db.getDemos(true);
    const faqs = db.getFaqs(true);
    const content = db.getContent();
    const settings = db.getSettings();

    // Sanitize public settings (omit internal webhook secrets)
    const publicSettings = {
      companyName: settings.companyName,
      tagline: settings.tagline,
      logoText: settings.logoText,
      primaryEmail: settings.primaryEmail,
      supportWhatsApp: settings.supportWhatsApp,
      whatsappDirectNumber: settings.whatsappDirectNumber,
      address: settings.address,
      officeHours: settings.officeHours,
      socialLinks: settings.socialLinks
    };

    res.json({
      success: true,
      data: {
        services,
        demos,
        faqs,
        content,
        settings: publicSettings
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load public content' });
  }
});

// GET /api/public/services
app.get('/api/public/services', (req: Request, res: Response) => {
  const services = db.getServices(true);
  res.json({ success: true, data: services });
});

// GET /api/public/services/:slug
app.get('/api/public/services/:slug', (req: Request, res: Response) => {
  const service = db.getServiceBySlug(req.params.slug);
  if (!service || !service.published) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, data: service });
});

// GET /api/public/demos
app.get('/api/public/demos', (req: Request, res: Response) => {
  const demos = db.getDemos(true);
  res.json({ success: true, data: demos });
});

// GET /api/public/faqs
app.get('/api/public/faqs', (req: Request, res: Response) => {
  const faqs = db.getFaqs(true);
  res.json({ success: true, data: faqs });
});

// GET /api/public/settings
app.get('/api/public/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    const publicSettings = {
      companyName: settings.companyName,
      tagline: settings.tagline,
      logoText: settings.logoText,
      primaryEmail: settings.primaryEmail,
      supportWhatsApp: settings.supportWhatsApp,
      whatsappDirectNumber: settings.whatsappDirectNumber,
      address: settings.address,
      officeHours: settings.officeHours,
      socialLinks: settings.socialLinks
    };
    res.json({ success: true, data: publicSettings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load public settings' });
  }
});

// POST /api/contact (Dedicated Contact Form Submission)
app.post('/api/contact', inquiryRateLimiter, async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      name,
      companyName,
      company,
      email,
      whatsapp,
      phone,
      service,
      subject,
      message,
      country,
      preferredContact,
      hp_field
    } = req.body;

    // Honeypot check
    if (hp_field) {
      console.warn('Honeypot trap triggered on contact form');
      return res.status(200).json({
        success: true,
        message: 'Thank you for contacting AHSAN AI LABS! We have received your query.',
        inquiryId: 'AHSAN-2026-CONFIRMED'
      });
    }

    const resolvedName = (fullName || name || '').trim();
    const resolvedEmail = (email || '').trim();
    const resolvedMessage = (message || '').trim();
    const resolvedWhatsApp = (whatsapp || phone || 'Not provided').trim();
    const resolvedCompany = (companyName || company || 'Direct Contact').trim();
    const resolvedService = (service || 'AI Agents') as any;

    if (!resolvedName || !resolvedEmail || !resolvedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, a valid email address, and a message description.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resolvedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email format.'
      });
    }

    // Save directly to database
    const savedInquiry = db.createInquiry({
      fullName: resolvedName,
      companyName: resolvedCompany,
      email: resolvedEmail,
      whatsapp: resolvedWhatsApp,
      country: country ? country.trim() : 'Global / Online',
      service: resolvedService,
      industry: 'Direct Consultation',
      businessDescription: 'Inquiry received via Contact Page Form',
      problem: resolvedMessage,
      requirements: subject ? `Subject: ${subject}\n\nMessage: ${resolvedMessage}` : resolvedMessage,
      timeline: 'Prompt / Flexible',
      budget: 'Consultation Scope',
      preferredContact: (preferredContact as any) || (resolvedWhatsApp !== 'Not provided' ? 'WhatsApp' : 'Email'),
      source: 'CONTACT_PAGE',
      subject: subject || 'Contact Page Consultation'
    });

    // Trigger Contact Webhook & Automation Workflow
    AutomationEngine.processNewInquiry(savedInquiry, 'CONTACT_FORM').catch(err => {
      console.error('Background contact automation error:', err);
    });

    // Audit Log
    db.logAudit({
      adminEmail: 'client@contact-page',
      action: 'CONTACT_FORM_SUBMITTED',
      targetType: 'INQUIRY',
      targetId: savedInquiry.inquiryId,
      details: `Contact form inquiry from ${resolvedName} (${resolvedCompany}) regarding ${resolvedService}.`,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to AHSAN AI LABS! We have successfully received your message and our team will get in touch with you shortly.',
      inquiryId: savedInquiry.inquiryId,
      inquiry: savedInquiry
    });
  } catch (err: any) {
    console.error('Error in /api/contact:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process your message. Please reach out directly on WhatsApp.'
    });
  }
});

// POST /api/inquiries (Client Project Order / Scope Submission with Honeypot & Anti-Spam Defense)
app.post('/api/inquiries', inquiryRateLimiter, async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      name,
      companyName,
      company,
      email,
      whatsapp,
      phone,
      country,
      service,
      industry,
      businessDescription,
      problem,
      requirements,
      timeline,
      budget,
      preferredContact,
      source,
      hp_field // Honeypot trap field (must remain empty)
    } = req.body;

    // Honeypot check: If bot filled the hidden honeypot field, silently return success without storing
    if (hp_field) {
      console.warn('Honeypot trap triggered, discarding spam submission');
      return res.status(200).json({
        success: true,
        message: 'Thank you for contacting AHSAN AI LABS! We have received your request.',
        inquiryId: 'AHSAN-2026-CONFIRMED'
      });
    }

    const resolvedName = (fullName || name || '').trim();
    const resolvedCompany = (companyName || company || 'Direct Client').trim();
    const resolvedEmail = (email || '').trim();
    const resolvedWhatsApp = (whatsapp || phone || '').trim();
    const resolvedProblem = (problem || '').trim();
    const resolvedRequirements = (requirements || resolvedProblem).trim();
    const resolvedService = (service || 'AI Agents') as any;
    const resolvedCountry = (country || 'Global / Online').trim();
    const resolvedSource = source || 'GET_STARTED_PAGE';

    // Input Validation
    if (!resolvedName || !resolvedEmail || (!resolvedProblem && !resolvedRequirements)) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Name, Email, and Project Description).'
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resolvedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 1. Save to Database FIRST (MongoDB / Persistent Store)
    const savedInquiry = db.createInquiry({
      fullName: resolvedName,
      companyName: resolvedCompany,
      email: resolvedEmail,
      whatsapp: resolvedWhatsApp || 'Not provided',
      country: resolvedCountry,
      service: resolvedService,
      industry: industry ? industry.trim() : 'General',
      businessDescription: businessDescription ? businessDescription.trim() : '',
      problem: resolvedProblem || 'Project Scope Inquiry',
      requirements: resolvedRequirements,
      timeline: timeline || 'Within 2-4 Weeks',
      budget: budget || 'Custom Scope',
      preferredContact: (preferredContact as any) || 'WhatsApp',
      source: resolvedSource
    });

    // 2. Trigger asynchronous, non-blocking n8n & notification automation
    const isContact = resolvedSource === 'CONTACT_PAGE';
    AutomationEngine.processNewInquiry(savedInquiry, isContact ? 'CONTACT_FORM' : 'ORDER_FORM').catch(err => {
      console.error('Background automation error:', err);
    });

    // 3. Log Audit
    db.logAudit({
      adminEmail: 'client@public-inquiry',
      action: 'INQUIRY_SUBMITTED',
      targetType: 'INQUIRY',
      targetId: savedInquiry.inquiryId,
      details: `New ${isContact ? 'Contact' : 'Project Scope'} inquiry submitted by ${resolvedName} (${resolvedCompany}) for ${resolvedService}.`,
      ip: req.ip
    });

    // 4. Return instant, reassuring response to user
    res.status(201).json({
      success: true,
      message: 'Thank you for contacting AHSAN AI LABS! We have successfully received your request. Our team will review your requirements and contact you as soon as possible.',
      inquiryId: savedInquiry.inquiryId,
      inquiry: savedInquiry
    });
  } catch (err: any) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while saving your inquiry. Please try again or contact us directly on WhatsApp.'
    });
  }
});

// ==========================================
// ADMIN AUTHENTICATION ROUTES
// ==========================================

// POST /api/admin/login
app.post('/api/admin/login', loginBruteForceProtector, (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = db.authenticateAdmin(email, password);

    if (!admin) {
      // Record failed attempt for rate limiting
      const now = Date.now();
      const current = loginAttemptsMap.get(ip) || { attempts: 0, lockUntil: 0 };
      current.attempts += 1;
      if (current.attempts >= MAX_LOGIN_ATTEMPTS) {
        current.lockUntil = now + LOGIN_LOCK_DURATION_MS;
      }
      loginAttemptsMap.set(ip, current);

      db.logAudit({
        adminEmail: email || 'unknown',
        action: 'ADMIN_LOGIN_FAILED',
        targetType: 'AUTH',
        details: `Failed authentication attempt (attempt ${current.attempts} of ${MAX_LOGIN_ATTEMPTS}) from IP ${ip}`,
        ip
      });

      const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - current.attempts);
      const message = current.attempts >= MAX_LOGIN_ATTEMPTS
        ? 'Account temporarily locked due to 5 consecutive failed attempts. Please try again after 15 minutes.'
        : `Invalid administrative credentials. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining)`;

      return res.status(401).json({ success: false, message });
    }

    // Success: clear failed attempts
    loginAttemptsMap.delete(ip);

    // Update last login
    db.updateAdminLastLogin(admin._id);

    const token = jwt.sign(
      {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    db.logAudit({
      adminEmail: admin.email,
      action: 'ADMIN_LOGIN_SUCCESS',
      targetType: 'AUTH',
      details: `Admin ${admin.name} (${admin.email}) successfully authenticated.`,
      ip
    });

    res.json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Authentication failed due to server error.' });
  }
});

// GET /api/admin/me
app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    admin: req.adminUser
  });
});

// POST /api/admin/change-password
app.post('/api/admin/change-password', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current password and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const adminId = req.adminUser?._id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Invalid session.' });
    }

    const admin = db.findAdminById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin record not found.' });
    }

    const passwordMatches = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!passwordMatches) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    db.updateAdminPassword(adminId, newPassword);

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'ADMIN_PASSWORD_CHANGED',
      targetType: 'AUTH',
      details: 'Administrator password successfully updated.'
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// GET /api/admin/dashboard-stats
app.get('/api/admin/dashboard-stats', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getDashboardStats();
  res.json({ success: true, data: stats });
});

// ==========================================
// ADMIN INQUIRIES MANAGEMENT
// ==========================================

// GET /api/admin/inquiries
app.get('/api/admin/inquiries', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const inquiries = db.getInquiries();
  res.json({ success: true, data: inquiries });
});

// GET /api/admin/inquiries/:id
app.get('/api/admin/inquiries/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
  }
  res.json({ success: true, data: inquiry });
});

// PATCH /api/admin/inquiries/:id (Status and field updates)
app.patch('/api/admin/inquiries/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { status, requirements, timeline, budget, preferredContact } = req.body;
  const inquiry = db.getInquiryById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
  }

  const oldStatus = inquiry.status;
  const updated = db.updateInquiry(req.params.id, {
    ...(status && { status }),
    ...(requirements && { requirements }),
    ...(timeline && { timeline }),
    ...(budget !== undefined && { budget }),
    ...(preferredContact && { preferredContact })
  });

  if (status && status !== oldStatus) {
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'INQUIRY_STATUS_CHANGED',
      targetType: 'INQUIRY',
      targetId: inquiry.inquiryId,
      details: `Status changed from ${oldStatus} to ${status}.`
    });
  }

  res.json({ success: true, data: updated });
});

// POST /api/admin/inquiries/:id/notes (Add internal note)
app.post('/api/admin/inquiries/:id/notes', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Note content cannot be empty.' });
  }

  const author = req.adminUser?.name || 'Admin Team';
  const updated = db.addInquiryNote(req.params.id, author, text.trim());
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
  }

  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'INQUIRY_NOTE_ADDED',
    targetType: 'INQUIRY',
    targetId: updated.inquiryId,
    details: `Added note: "${text.substring(0, 40)}..."`
  });

  res.json({ success: true, data: updated });
});

// POST /api/admin/inquiries/:id/retry-notification (Trigger n8n/notifications again)
app.post('/api/admin/inquiries/:id/retry-notification', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
  }

  db.updateInquiry(inquiry._id, { notificationStatus: 'RETRYING' });
  const result = await AutomationEngine.processNewInquiry(inquiry);

  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'NOTIFICATION_RETRIED',
    targetType: 'INQUIRY',
    targetId: inquiry.inquiryId,
    details: `Manual automation retry triggered. Result: ${result.n8nSuccess ? 'n8n OK' : 'n8n Failed'}`
  });

  const refreshed = db.getInquiryById(inquiry._id);
  res.json({ success: true, data: refreshed, result });
});

// DELETE /api/admin/inquiries/:id
app.delete('/api/admin/inquiries/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const inquiry = db.getInquiryById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
  }

  const inqId = inquiry.inquiryId;
  const deleted = db.deleteInquiry(req.params.id);

  if (deleted) {
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'INQUIRY_DELETED',
      targetType: 'INQUIRY',
      targetId: inqId,
      details: `Inquiry ${inqId} permanently deleted by admin.`
    });
  }

  res.json({ success: true, message: 'Inquiry deleted successfully.' });
});

// POST /api/admin/inquiries/bulk-delete (Bulk delete selected leads)
app.post('/api/admin/inquiries/bulk-delete', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'No inquiry IDs provided.' });
  }

  const deletedCount = db.bulkDeleteInquiries(ids);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'INQUIRIES_BULK_DELETED',
    targetType: 'INQUIRY',
    details: `Batch deleted ${deletedCount} inquiries.`
  });

  res.json({ success: true, message: `Successfully deleted ${deletedCount} inquiries.`, deletedCount });
});

// POST /api/admin/inquiries/bulk-status (Bulk update status of selected leads)
app.post('/api/admin/inquiries/bulk-status', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0 || !status) {
    return res.status(400).json({ success: false, message: 'Inquiry IDs array and target status are required.' });
  }

  const updatedCount = db.bulkUpdateInquiryStatus(ids, status);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'INQUIRIES_BULK_STATUS_UPDATED',
    targetType: 'INQUIRY',
    details: `Batch updated status of ${updatedCount} inquiries to ${status}.`
  });

  res.json({ success: true, message: `Successfully updated ${updatedCount} inquiries to ${status}.`, updatedCount });
});

// POST /api/admin/inquiries/manual-lead (Create direct inquiry lead from admin panel)
app.post('/api/admin/inquiries/manual-lead', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    fullName,
    companyName,
    email,
    whatsapp,
    country,
    service,
    industry,
    businessDescription,
    problem,
    requirements,
    timeline,
    budget,
    preferredContact
  } = req.body;

  if (!fullName || !companyName || !email) {
    return res.status(400).json({ success: false, message: 'Full Name, Company, and Email are required.' });
  }

  const newInquiry = db.createInquiry({
    fullName: fullName.trim(),
    companyName: companyName.trim(),
    email: email.trim(),
    whatsapp: (whatsapp || '').trim(),
    country: country ? country.trim() : 'United States',
    service: service || 'AI Agents',
    industry: industry ? industry.trim() : 'Technology',
    businessDescription: businessDescription ? businessDescription.trim() : '',
    problem: problem ? problem.trim() : 'Direct consultation request',
    requirements: requirements ? requirements.trim() : 'Direct client acquisition via Admin Portal',
    timeline: timeline || 'Within 2-4 Weeks',
    budget: budget || '$5,000 - $10,000',
    preferredContact: preferredContact || 'WhatsApp'
  });

  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'MANUAL_LEAD_CREATED',
    targetType: 'INQUIRY',
    targetId: newInquiry.inquiryId,
    details: `Direct lead created for ${newInquiry.fullName} (${newInquiry.companyName}).`
  });

  res.json({ success: true, data: newInquiry });
});

// POST /api/admin/upload-logo (Upload new logo and update public/logo.jpg)
app.post('/api/admin/upload-logo', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, message: 'Logo image data (base64) is required.' });
    }

    const base64Data = fileData.replace(/^data:image\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const publicLogoPath = path.join(process.cwd(), 'public', 'logo.jpg');
    fs.writeFileSync(publicLogoPath, buffer);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const timestampedName = `logo_${Date.now()}.jpg`;
    fs.writeFileSync(path.join(uploadsDir, timestampedName), buffer);

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'BRAND_LOGO_UPDATED',
      targetType: 'BRANDING',
      details: 'Brand logo updated to public/logo.jpg successfully.'
    });

    res.json({
      success: true,
      message: 'Brand logo updated successfully!',
      logoUrl: '/logo.jpg',
      timestamp: Date.now()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: `Failed to upload logo: ${err?.message || 'Server error'}` });
  }
});

// POST /api/admin/system/flush-cache (Memory and database maintenance)
app.post('/api/admin/system/flush-cache', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (global.gc) {
      global.gc();
    }
    db.persist();

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'SYSTEM_CACHE_FLUSHED',
      targetType: 'SYSTEM',
      details: 'Server memory cache flushed and database records synced.'
    });

    const metrics = db.getServerMetrics();
    res.json({
      success: true,
      message: 'System cache flushed and database synced successfully.',
      serverMetrics: metrics
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to flush cache.' });
  }
});

// GET /api/admin/system/diagnostics (Full system health diagnostics)
app.get('/api/admin/system/diagnostics', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serverMetrics = db.getServerMetrics();
    const mongoStatus = db.getMongoStatus();
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let totalUploads = 0;
    let totalUploadSizeMb = 0;

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      totalUploads = files.length;
      files.forEach(f => {
        try {
          const stat = fs.statSync(path.join(uploadsDir, f));
          totalUploadSizeMb += stat.size / (1024 * 1024);
        } catch (e) {}
      });
    }

    res.json({
      success: true,
      diagnostics: {
        server: serverMetrics,
        database: mongoStatus,
        inquiriesCount: db.getInquiries().length,
        demosCount: db.getDemos(false).length,
        servicesCount: db.getServices(false).length,
        faqsCount: db.getFaqs(false).length,
        auditLogsCount: db.getAuditLogs().length,
        uploads: {
          fileCount: totalUploads,
          totalSizeMb: totalUploadSizeMb.toFixed(2)
        },
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'production',
        currentTime: new Date().toISOString()
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve diagnostics.' });
  }
});

// POST /api/admin/clear-inquiries (Clear all inquiries)
app.post('/api/admin/clear-inquiries', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const count = db.clearAllInquiries();
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'INQUIRIES_PURGED',
    targetType: 'INQUIRY',
    details: `Purged ${count} test inquiries from database.`
  });
  res.json({ success: true, message: `Successfully cleared ${count} inquiries.`, clearedCount: count });
});

// GET /api/admin/backup (Export complete platform JSON backup)
app.get('/api/admin/backup', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: 'AHSAN AI LABS Enterprise Platform',
      version: '2.5.0',
      exportedBy: req.adminUser?.email || 'admin',
      data: {
        inquiries: db.getInquiries(),
        services: db.getServices(false),
        demos: db.getDemos(false),
        faqs: db.getFaqs(false),
        companyContent: db.getContent(),
        settings: db.getSettings(),
        auditLogs: db.getAuditLogs()
      }
    };

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'DATABASE_BACKUP_EXPORTED',
      targetType: 'SYSTEM',
      details: 'Full JSON system backup generated and downloaded.'
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="ahsan-ai-labs-backup-${Date.now()}.json"`);
    res.json(backupData);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate backup.' });
  }
});

// ==========================================
// ADMIN SERVICES CMS
// ==========================================

app.get('/api/admin/services', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const services = db.getServices(false);
  res.json({ success: true, data: services });
});

app.post('/api/admin/services', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, shortDescription, fullDescription, features, capabilities, useCases, benefits, demoVideoUrl, demoVideoThumbnail, ctaText, badge, displayOrder, published, iconName } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Service name is required.' });
  }

  const saved = db.saveService({
    name,
    shortDescription,
    fullDescription,
    features,
    capabilities,
    useCases,
    benefits,
    demoVideoUrl,
    demoVideoThumbnail,
    ctaText,
    badge,
    displayOrder,
    published,
    iconName
  });

  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'SERVICE_CREATED',
    targetType: 'SERVICE',
    targetId: saved._id,
    details: `Service "${saved.name}" created.`
  });

  res.json({ success: true, data: saved });
});

app.patch('/api/admin/services/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const saved = db.saveService({ _id: req.params.id, ...req.body });
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'SERVICE_UPDATED',
    targetType: 'SERVICE',
    targetId: saved._id,
    details: `Service "${saved.name}" updated.`
  });
  res.json({ success: true, data: saved });
});

app.delete('/api/admin/services/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  db.deleteService(req.params.id);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'SERVICE_DELETED',
    targetType: 'SERVICE',
    targetId: req.params.id,
    details: `Service ID ${req.params.id} deleted.`
  });
  res.json({ success: true, message: 'Service deleted.' });
});

// ==========================================
// ADMIN DEMOS CMS
// ==========================================

app.get('/api/admin/demos', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const demos = db.getDemos(false);
  res.json({ success: true, data: demos });
});

app.post('/api/admin/demos', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, description, features, thumbnail, videoUrl, duration, clientIndustry, keyImpact, published, featured, displayOrder } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Demo title is required.' });
  }

  const saved = db.saveDemo({
    title,
    category,
    description,
    features,
    thumbnail,
    videoUrl,
    duration,
    clientIndustry,
    keyImpact,
    published,
    featured,
    displayOrder
  });

  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'DEMO_CREATED',
    targetType: 'DEMO',
    targetId: saved._id,
    details: `Showcase demo "${saved.title}" created.`
  });

  res.json({ success: true, data: saved });
});

app.patch('/api/admin/demos/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const saved = db.saveDemo({ _id: req.params.id, ...req.body });
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'DEMO_UPDATED',
    targetType: 'DEMO',
    targetId: saved._id,
    details: `Showcase demo "${saved.title}" updated.`
  });
  res.json({ success: true, data: saved });
});

app.delete('/api/admin/demos/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  db.deleteDemo(req.params.id);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'DEMO_DELETED',
    targetType: 'DEMO',
    targetId: req.params.id,
    details: `Demo ID ${req.params.id} deleted.`
  });
  res.json({ success: true, message: 'Demo deleted.' });
});

// POST /api/admin/upload-media (Upload demo videos, images, attachments)
app.post('/api/admin/upload-media', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileName, fileData, fileType } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ success: false, message: 'fileName and fileData (base64 string) are required.' });
    }

    // Sanitize extension
    const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'mp4';
    const allowedExts = ['mp4', 'webm', 'mov', 'm4v', 'ogg', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'];
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: `File format .${ext} is not permitted. Allowed formats: ${allowedExts.join(', ')}`
      });
    }

    // Clean base64 header if present (e.g. data:video/mp4;base64,...)
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create uploads directory if not exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create safe unique filename
    const safeBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
    const uniqueFileName = `media_${Date.now()}_${safeBaseName}.${ext}`;
    const targetFilePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'MEDIA_UPLOADED',
      targetType: 'MEDIA',
      targetId: uniqueFileName,
      details: `Admin uploaded media asset "${uniqueFileName}" (${(buffer.length / (1024 * 1024)).toFixed(2)} MB).`
    });

    res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      sizeBytes: buffer.length,
      sizeMb: (buffer.length / (1024 * 1024)).toFixed(2)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: `Upload failed: ${err?.message || 'Server error'}` });
  }
});

// ==========================================
// ADMIN FAQS CMS
// ==========================================

app.get('/api/admin/faqs', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const faqs = db.getFaqs(false);
  res.json({ success: true, data: faqs });
});

app.post('/api/admin/faqs', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { question, answer, category, displayOrder, published } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required.' });
  }

  const saved = db.saveFaq({ question, answer, category, displayOrder, published });
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'FAQ_CREATED',
    targetType: 'FAQ',
    targetId: saved._id,
    details: `FAQ "${saved.question.substring(0, 30)}..." created.`
  });
  res.json({ success: true, data: saved });
});

app.patch('/api/admin/faqs/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const saved = db.saveFaq({ _id: req.params.id, ...req.body });
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'FAQ_UPDATED',
    targetType: 'FAQ',
    targetId: saved._id,
    details: `FAQ ID ${saved._id} updated.`
  });
  res.json({ success: true, data: saved });
});

app.delete('/api/admin/faqs/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  db.deleteFaq(req.params.id);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'FAQ_DELETED',
    targetType: 'FAQ',
    targetId: req.params.id,
    details: `FAQ ID ${req.params.id} deleted.`
  });
  res.json({ success: true, message: 'FAQ deleted.' });
});

// ==========================================
// ADMIN CONTENT, SETTINGS, BACKUP, AUDIT & WEBHOOK TEST
// ==========================================

app.get('/api/admin/content', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const content = db.getContent();
  res.json({ success: true, data: content });
});

app.put('/api/admin/content', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateContent(req.body);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'CONTENT_CMS_UPDATED',
    targetType: 'CONTENT',
    details: 'Company content / Founder bio / Hero CMS updated.'
  });
  res.json({ success: true, data: updated });
});

app.get('/api/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const settings = db.getSettings();
  res.json({ success: true, data: settings });
});

app.put('/api/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSettings(req.body);
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'SETTINGS_UPDATED',
    targetType: 'SETTINGS',
    details: 'Platform settings & Webhook configuration updated.'
  });
  res.json({ success: true, data: updated });
});

app.get('/api/admin/audit-logs', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ success: true, data: logs });
});

// Database Export Endpoint
app.get('/api/admin/export-data', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const snapshot = db.exportDatabase();
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'DATABASE_EXPORTED',
    targetType: 'DATABASE',
    details: 'Full platform database exported as JSON backup.'
  });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=ahsan_ai_labs_backup_${Date.now()}.json`);
  res.send(JSON.stringify(snapshot, null, 2));
});

// Database Import Endpoint
app.post('/api/admin/import-data', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = db.importDatabase(req.body);
  if (!success) {
    return res.status(400).json({ success: false, message: 'Invalid backup structure.' });
  }
  db.logAudit({
    adminEmail: req.adminUser?.email || 'admin',
    action: 'DATABASE_RESTORED',
    targetType: 'DATABASE',
    details: 'Platform database restored from JSON backup.'
  });
  res.json({ success: true, message: 'Database restored successfully.' });
});

// MongoDB Status Endpoint
app.get('/api/admin/database/status', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = db.getMongoStatus();
    const metrics = await db.getDatabaseMetrics();
    res.json({ success: true, status, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve database status.' });
  }
});

// Test MongoDB Live Connectivity & Latency
app.post('/api/admin/database/test', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { uri, dbName } = req.body;
    const result = await db.testMongoConnection(uri, dbName);
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'MONGODB_CONNECTIVITY_TESTED',
      targetType: 'DATABASE',
      details: `Tested MongoDB connection (${result.databaseName}). Status: ${result.success ? 'SUCCESS (' + result.latencyMs + 'ms)' : 'FAILED'}`
    });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Database test failed.' });
  }
});

// Reconnect MongoDB with optional new URI
app.post('/api/admin/database/reconnect', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { uri, dbName } = req.body;
    const connected = await db.reconnectMongo(uri, dbName);
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'MONGODB_RECONNECTED',
      targetType: 'DATABASE',
      details: `Reconnection attempt ${connected ? 'SUCCEEDED' : 'FAILED'} for DB: ${dbName || 'AHSAN_AI_LABS'}`
    });
    res.json({
      success: connected,
      message: connected ? 'MongoDB reconnected and synchronized successfully.' : 'Could not connect to MongoDB. Please verify connection credentials.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to reconnect.' });
  }
});

// Force Sync local store to MongoDB
app.post('/api/admin/database/sync', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const syncResult = await db.forceSyncToMongo();
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'DATABASE_FORCE_SYNCED',
      targetType: 'DATABASE',
      details: `Manual sync triggered. ${syncResult.success ? 'Synced all collections.' : 'Sync failed.'}`
    });
    res.json(syncResult);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Sync failed.' });
  }
});

app.post('/api/admin/test-webhook', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { url, secret, type } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'Webhook URL is required for testing.' });
  }

  try {
    const testResult = await AutomationEngine.testWebhook(url, secret, type || 'GENERAL');
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'WEBHOOK_TEST_EXECUTED',
      targetType: 'INTEGRATION',
      details: `Dispatched ${type || 'GENERAL'} test ping to ${url}. Result: HTTP ${testResult.status}`
    });
    res.json({ success: true, data: testResult });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to ping webhook' });
  }
});

// Dispatch live sample inquiry to n8n flow to test full workflow (Gmail + WhatsApp)
app.post('/api/admin/test-sample-inquiry', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.body;
  try {
    const flowType = type === 'CONTACT' ? 'CONTACT' : 'ORDER';
    const result = await AutomationEngine.sendSampleInquiry(flowType);
    
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'SAMPLE_INQUIRY_AUTOMATION_TESTED',
      targetType: 'INTEGRATION',
      details: `Dispatched full simulated ${flowType} inquiry payload to test n8n workflow.`
    });

    res.json({
      success: true,
      message: `Simulated ${flowType} inquiry payload dispatched successfully!`,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to dispatch sample inquiry' });
  }
});

// ==========================================
// ADMIN ANALYTICS & MONITORING ENDPOINTS
// ==========================================

// GET /api/admin/analytics - Detailed Website & Conversion Analytics
app.get('/api/admin/analytics', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const range = (req.query.range as any) || '7d';
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const summary = db.getAnalyticsSummary(range, from, to);
    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics telemetry' });
  }
});

// GET /api/admin/performance - Web Vitals, Latency & Core Performance Metrics
app.get('/api/admin/performance', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const perfData = db.getPerformanceDashboardData();
    res.json({ success: true, data: perfData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve performance metrics' });
  }
});

// GET /api/admin/system-health - Full Server, Process, PM2, and Database Health
app.get('/api/admin/system-health', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const health = await db.getSystemHealth();
    res.json({ success: true, data: health });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve system health' });
  }
});

// GET /api/admin/uptime - Uptime History & Incident Logs
app.get('/api/admin/uptime', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const uptime = db.getUptimeSummary();
    res.json({ success: true, data: uptime });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve uptime logs' });
  }
});

// GET /api/admin/database-metrics - MongoDB & Storage Metrics
app.get('/api/admin/database-metrics', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = await db.getDatabaseMetrics();
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve database metrics' });
  }
});

// GET /api/admin/errors - Error logs with status & severity filtering
app.get('/api/admin/errors', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const severity = req.query.severity as string | undefined;
    const search = req.query.search as string | undefined;
    const logs = db.getErrorLogs(status, severity, search);
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load error logs' });
  }
});

// PATCH /api/admin/errors/:id - Update error resolution status
app.patch('/api/admin/errors/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !['UNRESOLVED', 'INVESTIGATING', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const updated = db.updateErrorStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Error log not found' });
    }

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'ERROR_STATUS_UPDATED',
      targetType: 'SYSTEM',
      details: `Marked error "${updated.title}" as ${status}`
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update error status' });
  }
});

// DELETE /api/admin/errors/:id - Delete error log
app.delete('/api/admin/errors/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = db.deleteErrorLog(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Error log not found' });
    }
    res.json({ success: true, message: 'Error log removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete error log' });
  }
});

// GET /api/admin/automation-stats - n8n & Notification metrics
app.get('/api/admin/automation-stats', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = db.getAutomationMetrics();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve automation metrics' });
  }
});

// POST /api/admin/inquiries/:id/retry-notification - Retry webhook dispatch for inquiry
app.post('/api/admin/inquiries/:id/retry-notification', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const inquiry = db.getInquiryById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const result = await AutomationEngine.processNewInquiry(inquiry);

    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'NOTIFICATION_RETRY_TRIGGERED',
      targetType: 'INQUIRY',
      targetId: inquiry.inquiryId,
      details: `Retried webhook notification. Result: ${result.n8nSuccess || result.whatsappAdminSuccess ? 'Success' : 'Failed'}`
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retry notification delivery' });
  }
});

// GET /api/admin/alerts - System threshold alerts
app.get('/api/admin/alerts', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const alerts = db.getSystemAlerts();
    res.json({ success: true, data: alerts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load system alerts' });
  }
});

// POST /api/admin/alerts/:id/ack - Acknowledge alert
app.post('/api/admin/alerts/:id/ack', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const ack = db.acknowledgeAlert(req.params.id);
    res.json({ success: ack });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to acknowledge alert' });
  }
});

// 404 JSON Handler for unmatched API routes
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.path} not found`
  });
});

// ==========================================
// VITE MIDDLEWARE & SERVER BOOTSTRAP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static assets with 1 year cache for hashed assets and 1 day for others
    app.use(express.static(distPath, {
      maxAge: '1y',
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else if (filePath.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AHSAN AI LABS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
