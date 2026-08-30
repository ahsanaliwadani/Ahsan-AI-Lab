import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { AutomationEngine } from './server/automation';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.ADMIN_SECRET || process.env.JWT_SECRET || 'ahsan_ai_labs_super_secure_jwt_secret_key_2026';

// Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Body Parser with strict limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static public folder for robots.txt, sitemap.xml, favicon
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

// In-memory rate limiter for public inquiry submissions
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
// PUBLIC API & HEALTH ROUTES
// ==========================================

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

// POST /api/inquiries (Client Inquiry Submission with Honeypot & Anti-Spam Defense)
app.post('/api/inquiries', inquiryRateLimiter, async (req: Request, res: Response) => {
  try {
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
      preferredContact,
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

    // Input Validation
    if (!fullName || !companyName || !email || !whatsapp || !country || !service || !problem || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Name, Company, Email, WhatsApp, Country, Service, Problem description, and Requirements).'
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 1. Save to Database FIRST (MongoDB / Persistent Store)
    const savedInquiry = db.createInquiry({
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      country: country.trim(),
      service,
      industry: industry ? industry.trim() : 'General',
      businessDescription: businessDescription ? businessDescription.trim() : '',
      problem: problem.trim(),
      requirements: requirements.trim(),
      timeline: timeline || 'Flexible',
      budget: budget || '',
      preferredContact: preferredContact || 'WhatsApp'
    });

    // 2. Trigger asynchronous, non-blocking n8n & notification automation
    AutomationEngine.processNewInquiry(savedInquiry).catch(err => {
      console.error('Background automation error:', err);
    });

    // 3. Log Audit
    db.logAudit({
      adminEmail: 'client@public-inquiry',
      action: 'INQUIRY_SUBMITTED',
      targetType: 'INQUIRY',
      targetId: savedInquiry.inquiryId,
      details: `New inquiry submitted by ${fullName} (${companyName}) for ${service}.`,
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
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = db.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const passwordMatches = bcrypt.compareSync(password, admin.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

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
      action: 'ADMIN_LOGIN',
      targetType: 'AUTH',
      details: `Admin ${admin.name} successfully authenticated.`,
      ip: req.ip
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

app.post('/api/admin/test-webhook', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { url, secret } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'Webhook URL is required for testing.' });
  }

  try {
    const testResult = await AutomationEngine.testWebhook(url, secret);
    db.logAudit({
      adminEmail: req.adminUser?.email || 'admin',
      action: 'WEBHOOK_TEST_EXECUTED',
      targetType: 'INTEGRATION',
      details: `Dispatched test ping to ${url}. Result: HTTP ${testResult.status}`
    });
    res.json({ success: true, data: testResult });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed to ping webhook' });
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
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AHSAN AI LABS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
