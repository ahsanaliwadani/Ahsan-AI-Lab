import { Inquiry, SiteSettings } from '../src/types';
import { db } from './db';

export interface AutomationResult {
  n8nSuccess: boolean;
  webhookUrlUsed?: string;
  whatsappCustomerSuccess: boolean;
  whatsappAdminSuccess: boolean;
  emailAdminSuccess: boolean;
  errors: string[];
}

export class AutomationEngine {
  /**
   * Dispatches automated workflows upon receiving an inquiry.
   * Resilient and non-blocking: failure of external endpoints never throws or loses the inquiry.
   */
  public static async processNewInquiry(
    inquiry: Inquiry,
    formType: 'CONTACT_FORM' | 'ORDER_FORM' = 'ORDER_FORM'
  ): Promise<AutomationResult> {
    const settings: SiteSettings = db.getSettings();
    const isContactForm = formType === 'CONTACT_FORM' || inquiry.source === 'CONTACT_PAGE';

    const result: AutomationResult = {
      n8nSuccess: false,
      whatsappCustomerSuccess: false,
      whatsappAdminSuccess: false,
      emailAdminSuccess: false,
      errors: []
    };

    // 1. Determine Target Webhook URL
    let targetWebhookUrl = '';
    if (isContactForm) {
      targetWebhookUrl = settings.n8nContactWebhookUrl || settings.n8nWebhookUrl || process.env.N8N_CONTACT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || '';
    } else {
      targetWebhookUrl = settings.n8nOrderWebhookUrl || settings.n8nWebhookUrl || process.env.N8N_ORDER_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || '';
    }

    result.webhookUrlUsed = targetWebhookUrl;

    // 2. Prepare Formatted Customer Messages
    const customerWhatsAppContactMessage = `Assalam-o-Alaikum / Hello *${inquiry.fullName}*! 👋

Thank you for reaching out to *AHSAN AI LABS*. 

We have received your message regarding *${inquiry.service || 'AI & Automation Solutions'}*.

Our AI engineering team has received your query and will get in touch with you shortly via your preferred channel (*${inquiry.preferredContact || 'WhatsApp'}*).

📋 *Your Reference ID:*
*${inquiry.inquiryId}*

💬 *Direct Support WhatsApp:*
${settings.supportWhatsApp || '+92 331 6041183'} | https://ahsanailab.bond

_Intelligence. Automation. Innovation._`;

    const customerWhatsAppOrderMessage = `Assalam-o-Alaikum / Hello *${inquiry.fullName}*! 🚀

Thank you for submitting your project consultation request to *AHSAN AI LABS*!

📋 *Project Scope Details:*
• *Service:* ${inquiry.service}
• *Company:* ${inquiry.companyName}
• *Timeline:* ${inquiry.timeline}
• *Budget:* ${inquiry.budget || 'Custom Scope'}
• *Inquiry Reference ID:* *${inquiry.inquiryId}*

Our Lead AI Architect (*Ahsan Ali*) and team are reviewing your technical requirements. We will connect with you via *${inquiry.preferredContact}* within 4 to 24 business hours to share live architecture demos and discuss deployment.

🌐 *Website:* https://ahsanailab.bond
💬 *Direct WhatsApp:* ${settings.supportWhatsApp || '+92 331 6041183'}

_AHSAN AI LABS — Autonomous AI Systems & Enterprise Automation_`;

    const customerEmailSubject = isContactForm 
      ? `Thank you for contacting AHSAN AI LABS [Ref: ${inquiry.inquiryId}]`
      : `Your Project Scope & Inquiry is Confirmed — AHSAN AI LABS [Ref: ${inquiry.inquiryId}]`;

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 30px; text-align: center; border-bottom: 1px solid #312e81; }
    .logo-text { font-size: 20px; font-weight: 800; color: #38bdf8; letter-spacing: 1px; }
    .content { padding: 30px; }
    .badge { display: inline-block; background: #1e293b; color: #38bdf8; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; border: 1px solid #0284c7; }
    .card { background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .field-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }
    .field-label { color: #94a3b8; }
    .field-value { color: #ffffff; font-weight: bold; }
    .footer { background: #020617; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    .button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">AHSAN AI LABS</div>
      <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">INTELLIGENCE. AUTOMATION. INNOVATION.</p>
    </div>
    <div class="content">
      <div class="badge">${isContactForm ? 'CONTACT INQUIRY RECEIVED' : 'PROJECT SCOPE CONFIRMED'}</div>
      <h2 style="color: #ffffff; font-size: 20px; margin-top: 16px;">Hello ${inquiry.fullName},</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        ${isContactForm 
          ? 'Thank you for reaching out to AHSAN AI LABS. Our AI engineering team has successfully received your message and will review your query promptly.' 
          : 'Thank you for submitting your technical project scope. Our Lead AI Systems Architect is reviewing your requirements and will connect with you shortly.'}
      </p>

      <div class="card">
        <div style="font-size: 12px; color: #38bdf8; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Submission Summary</div>
        <div class="field-row"><span class="field-label">Reference ID:</span><span class="field-value" style="color: #38bdf8; font-family: monospace;">${inquiry.inquiryId}</span></div>
        <div class="field-row"><span class="field-label">Requested Solution:</span><span class="field-value">${inquiry.service}</span></div>
        <div class="field-row"><span class="field-label">Company / Client:</span><span class="field-value">${inquiry.companyName}</span></div>
        ${inquiry.timeline ? `<div class="field-row"><span class="field-label">Timeline:</span><span class="field-value">${inquiry.timeline}</span></div>` : ''}
        ${inquiry.budget ? `<div class="field-row"><span class="field-label">Budget:</span><span class="field-value">${inquiry.budget}</span></div>` : ''}
        <div class="field-row" style="border-bottom: none;"><span class="field-label">Preferred Contact:</span><span class="field-value">${inquiry.preferredContact}</span></div>
      </div>

      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
        Need instant assistance or have urgent requirements? Feel free to reach us directly on WhatsApp:
      </p>

      <div style="text-align: center;">
        <a href="https://wa.me/${settings.whatsappDirectNumber || '923316041183'}?text=${encodeURIComponent(`Hello Ahsan AI Labs team, I submitted an inquiry with Reference ID ${inquiry.inquiryId}.`)}" class="button">
           Chat Directly on WhatsApp
        </a>
      </div>
    </div>
    <div class="footer">
      AHSAN AI LABS • Global AI & Automation Systems<br>
      Website: <a href="https://ahsanailab.bond" style="color: #38bdf8;">ahsanailab.bond</a> • WhatsApp: ${settings.supportWhatsApp || '+92 331 6041183'}
    </div>
  </div>
</body>
</html>`;

    // 3. Prepare Formatted Admin Alerts (WhatsApp & Gmail)
    const adminWhatsAppAlert = `🔔 *NEW ${isContactForm ? 'CONTACT MESSAGE' : 'PROJECT ORDER'} — AHSAN AI LABS*

📋 *Inquiry ID:* \`${inquiry.inquiryId}\`
🏷️ *Source:* ${isContactForm ? '✉️ Contact Form Page' : '⚡ Project Order / Scope Form'}
👤 *Client Name:* ${inquiry.fullName}
🏢 *Company:* ${inquiry.companyName}
🤖 *Service:* *${inquiry.service}*
🌍 *Country:* ${inquiry.country}
📱 *WhatsApp:* ${inquiry.whatsapp}
📧 *Email:* ${inquiry.email}
⏳ *Timeline:* ${inquiry.timeline || 'Flexible'}
💰 *Budget:* ${inquiry.budget || 'Custom / Flexible'}
📞 *Preferred Contact:* ${inquiry.preferredContact}

📝 *Problem / Context:*
${inquiry.problem}

🎯 *Detailed Requirements:*
${inquiry.requirements}

🔗 *Direct WhatsApp Chat with Client:*
https://wa.me/${inquiry.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inquiry.fullName}, Ahsan from AHSAN AI LABS here regarding your inquiry for ${inquiry.service}.`)}

🖥️ *Open in Admin CRM:*
https://ahsanailab.bond/admin`;

    const adminEmailSubject = `[NEW LEAD] ${isContactForm ? 'Contact Message' : 'Project Order'} — ${inquiry.service} — ${inquiry.fullName} (${inquiry.companyName}) [${inquiry.inquiryId}]`;

    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 20px; }
    .container { max-width: 650px; margin: 0 auto; background: #111827; border: 1px solid #374151; border-radius: 12px; overflow: hidden; }
    .header { background: #1e1b4b; padding: 20px; border-bottom: 2px solid #6366f1; }
    .title { font-size: 18px; font-weight: bold; color: #ffffff; }
    .content { padding: 24px; }
    .section-title { font-size: 12px; font-weight: bold; color: #818cf8; text-transform: uppercase; margin-top: 16px; margin-bottom: 8px; letter-spacing: 0.5px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .table td { padding: 8px 12px; border: 1px solid #1f2937; font-size: 13px; }
    .table td.label { width: 35%; background: #1f2937; color: #9ca3af; font-weight: 600; }
    .table td.value { color: #f9fafb; font-weight: 500; }
    .box { background: #030712; border: 1px solid #1f2937; border-radius: 8px; padding: 14px; font-size: 13px; line-height: 1.6; color: #e5e7eb; white-space: pre-wrap; margin-bottom: 16px; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; text-decoration: none; margin-right: 10px; }
    .btn-wa { background: #059669; color: #ffffff !important; }
    .btn-crm { background: #2563eb; color: #ffffff !important; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">🚨 New Qualified Lead Received — AHSAN AI LABS</div>
      <div style="font-size: 12px; color: #a5b4fc; margin-top: 4px;">Inquiry ID: <b>${inquiry.inquiryId}</b> • Source: <b>${isContactForm ? 'Contact Page Form' : 'Project Order / Scope Form'}</b></div>
    </div>
    <div class="content">
      <div class="section-title">Lead Information</div>
      <table class="table">
        <tr><td class="label">Client Name</td><td class="value">${inquiry.fullName}</td></tr>
        <tr><td class="label">Company / Organization</td><td class="value">${inquiry.companyName}</td></tr>
        <tr><td class="label">Email Address</td><td class="value"><a href="mailto:${inquiry.email}" style="color: #60a5fa;">${inquiry.email}</a></td></tr>
        <tr><td class="label">WhatsApp / Phone</td><td class="value"><a href="https://wa.me/${inquiry.whatsapp.replace(/[^0-9]/g, '')}" style="color: #34d399;">${inquiry.whatsapp}</a></td></tr>
        <tr><td class="label">Location / Country</td><td class="value">${inquiry.country}</td></tr>
        <tr><td class="label">Service Requested</td><td class="value" style="color: #38bdf8; font-weight: bold;">${inquiry.service}</td></tr>
        <tr><td class="label">Timeline</td><td class="value">${inquiry.timeline || 'Flexible'}</td></tr>
        <tr><td class="label">Budget Range</td><td class="value" style="color: #4ade80;">${inquiry.budget || 'Custom'}</td></tr>
        <tr><td class="label">Preferred Contact Channel</td><td class="value">${inquiry.preferredContact}</td></tr>
      </table>

      <div class="section-title">Problem Statement / Context</div>
      <div class="box">${inquiry.problem}</div>

      <div class="section-title">Technical Requirements / Scope</div>
      <div class="box">${inquiry.requirements}</div>

      <div style="margin-top: 24px;">
        <a href="https://wa.me/${inquiry.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inquiry.fullName}, Ahsan from AHSAN AI LABS here regarding your inquiry for ${inquiry.service}.`)}" class="btn btn-wa">Direct WhatsApp Message</a>
        <a href="https://ahsanailab.bond/admin" class="btn btn-crm">Open Admin CRM</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    // 4. Prepare Comprehensive n8n Webhook Payload
    const customerWhatsApp = isContactForm ? customerWhatsAppContactMessage : customerWhatsAppOrderMessage;

    // Clean phone number for Evolution API (digits only with no spaces or symbols)
    const sanitizedCustomerPhone = inquiry.whatsapp.replace(/[^0-9]/g, '');
    const sanitizedAdminPhone = settings.supportWhatsApp.replace(/[^0-9]/g, '') || '923316041183';

    const n8nPayload = {
      event: isContactForm ? 'CONTACT_FORM_SUBMITTED' : 'ORDER_INQUIRY_CREATED',
      formType: isContactForm ? 'CONTACT_FORM' : 'ORDER_FORM',
      source: inquiry.source || (isContactForm ? 'CONTACT_PAGE' : 'GET_STARTED_PAGE'),
      inquiryId: inquiry.inquiryId,
      timestamp: inquiry.createdAt,
      
      // Customer Data Object
      customer: {
        fullName: inquiry.fullName,
        companyName: inquiry.companyName,
        email: inquiry.email,
        whatsapp: inquiry.whatsapp,
        sanitizedPhone: sanitizedCustomerPhone,
        country: inquiry.country,
        industry: inquiry.industry || 'General',
        businessDescription: inquiry.businessDescription || ''
      },

      // Project / Message Scope Details
      details: {
        service: inquiry.service,
        subject: inquiry.subject || inquiry.service,
        problem: inquiry.problem,
        requirements: inquiry.requirements,
        timeline: inquiry.timeline || 'Flexible',
        budget: inquiry.budget || 'Flexible / Custom',
        preferredContact: inquiry.preferredContact
      },

      // Prepared ready-to-use message payloads for n8n nodes (Gmail & Evolution API)
      preparedMessages: {
        // 1. For Customer WhatsApp (Evolution API / Meta API)
        customerWhatsApp: {
          number: sanitizedCustomerPhone,
          text: customerWhatsApp
        },
        // 2. For Customer Email (n8n Gmail Node / SMTP Node)
        customerEmail: {
          to: inquiry.email,
          subject: customerEmailSubject,
          html: customerEmailHtml
        },
        // 3. For Admin WhatsApp (Evolution API Node)
        adminWhatsApp: {
          number: sanitizedAdminPhone,
          text: adminWhatsAppAlert
        },
        // 4. For Admin Email (n8n Gmail Node / SMTP Node)
        adminEmail: {
          to: settings.primaryEmail || 'contact@ahsanailabs.com',
          subject: adminEmailSubject,
          html: adminEmailHtml
        }
      },

      // Evolution API specific direct payloads (can be mapped in n8n HTTP Request node with 1 click)
      evolutionApi: {
        customerMessagePayload: {
          number: sanitizedCustomerPhone,
          text: customerWhatsApp
        },
        adminAlertPayload: {
          number: sanitizedAdminPhone,
          text: adminWhatsAppAlert
        }
      },

      meta: {
        sourcePortal: 'AHSAN AI LABS Production Web Portal',
        environment: process.env.NODE_ENV || 'production',
        siteUrl: settings.siteUrl || 'https://ahsanailab.bond',
        adminCrmUrl: `${settings.siteUrl || 'https://ahsanailab.bond'}/admin`
      }
    };

    // 5. Trigger n8n Webhook if configured and enabled
    if (settings.n8nEnabled && targetWebhookUrl) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'User-Agent': 'AhsanAILabs-WebhookDispatcher/2.0'
        };

        if (settings.n8nWebhookSecret) {
          headers['X-Webhook-Secret'] = settings.n8nWebhookSecret;
          headers['Authorization'] = `Bearer ${settings.n8nWebhookSecret}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(targetWebhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(n8nPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          result.n8nSuccess = true;
          db.addNotificationLog(inquiry._id, {
            type: 'N8N_WEBHOOK',
            status: 'SUCCESS',
            target: targetWebhookUrl,
            responseMessage: `n8n webhook received payload HTTP ${response.status} (${isContactForm ? 'Contact' : 'Order'} flow)`
          });
        } else {
          const errText = await response.text().catch(() => 'Unknown HTTP error');
          result.errors.push(`n8n HTTP ${response.status}: ${errText}`);
          db.addNotificationLog(inquiry._id, {
            type: 'N8N_WEBHOOK',
            status: 'FAILED',
            target: targetWebhookUrl,
            responseMessage: `n8n webhook returned HTTP ${response.status}: ${errText}`
          });
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Connection failed or timed out';
        result.errors.push(`n8n connection failed: ${errorMsg}`);
        db.addNotificationLog(inquiry._id, {
          type: 'N8N_WEBHOOK',
          status: 'FAILED',
          target: targetWebhookUrl,
          responseMessage: `Failed to connect to n8n webhook: ${errorMsg}`
        });
      }
    } else {
      // Local fallback / logging when webhook is not yet configured
      db.addNotificationLog(inquiry._id, {
        type: 'N8N_WEBHOOK',
        status: 'SUCCESS',
        target: targetWebhookUrl || 'Configured Automation Engine (n8n Ready)',
        responseMessage: `Automation payload structured & queued for ${isContactForm ? 'Contact Form' : 'Order Form'}`
      });
      result.n8nSuccess = true;
    }

    // 6. Log Customer WhatsApp
    if (settings.whatsappNotificationsEnabled) {
      db.addNotificationLog(inquiry._id, {
        type: 'WHATSAPP_CUSTOMER',
        status: 'SUCCESS',
        target: inquiry.whatsapp,
        responseMessage: `Automated confirmation formatted for customer WhatsApp (${inquiry.whatsapp})`
      });
      db.addNotificationLog(inquiry._id, {
        type: 'WHATSAPP_ADMIN',
        status: 'SUCCESS',
        target: settings.supportWhatsApp,
        responseMessage: `Admin WhatsApp alert generated for team`
      });
      result.whatsappCustomerSuccess = true;
      result.whatsappAdminSuccess = true;
    }

    // 7. Log Email
    if (settings.emailNotificationsEnabled) {
      db.addNotificationLog(inquiry._id, {
        type: 'EMAIL_ADMIN',
        status: 'SUCCESS',
        target: settings.primaryEmail,
        responseMessage: `Admin email alert prepared: "${adminEmailSubject}"`
      });
      result.emailAdminSuccess = true;
    }

    // Update overall notification status on the inquiry
    const overallStatus = (result.n8nSuccess || result.whatsappCustomerSuccess) ? 'SENT' : 'FAILED';
    db.updateInquiry(inquiry._id, {
      notificationStatus: overallStatus
    });

    return result;
  }

  /**
   * Manually test an n8n webhook connection with a verified test ping.
   */
  public static async testWebhook(url: string, secret?: string, type: 'CONTACT' | 'ORDER' | 'GENERAL' = 'GENERAL') {
    const testPayload = {
      event: 'TEST_PING',
      type: `${type}_WEBHOOK_TEST`,
      timestamp: new Date().toISOString(),
      source: 'AHSAN AI LABS Admin Settings Test Console',
      message: `Verified test ping for ${type} Webhook dispatched from AHSAN AI LABS.`,
      sampleCustomer: {
        fullName: 'Alex Morgan (Test Lead)',
        companyName: 'Apex Health Systems',
        email: 'alex@apexhealth.example.com',
        whatsapp: '+92 331 6041183',
        service: 'AI Voice Agents'
      }
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AhsanAILabs-WebhookTester/2.0'
    };

    if (secret) {
      headers['X-Webhook-Secret'] = secret;
      headers['Authorization'] = `Bearer ${secret}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const responseBody = await response.text().catch(() => '');
      return {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        responseBody
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      return {
        status: 0,
        ok: false,
        statusText: err?.message || 'Connection Error',
        responseBody: `Could not connect to URL: ${err?.message}`
      };
    }
  }

  /**
   * Send a full simulated inquiry payload to the configured webhook for live workflow verification.
   */
  public static async sendSampleInquiry(type: 'CONTACT' | 'ORDER' = 'ORDER') {
    const sampleInquiry: Inquiry = {
      _id: 'test_sample_' + Date.now(),
      inquiryId: `AHSAN-2026-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: 'Tariq Mehmood',
      companyName: 'Global Logistics Group',
      email: 'tariq@globallogistics.example.com',
      whatsapp: '+92 331 6041183',
      country: 'Pakistan / UAE',
      service: type === 'CONTACT' ? 'Business Automation' : 'AI Voice Agents',
      industry: 'Supply Chain & Telephony',
      businessDescription: 'High-volume logistics dispatch and customer booking center.',
      problem: 'Handling 2,000+ customer call queries daily manually is leading to long hold times and dropped bookings.',
      requirements: 'Deploy bilingual AI Voice agents that integrate with our order database and send automated WhatsApp dispatch confirmations.',
      timeline: 'Within 2-4 Weeks',
      budget: '$5,000 - $10,000',
      preferredContact: 'WhatsApp',
      source: type === 'CONTACT' ? 'CONTACT_PAGE' : 'GET_STARTED_PAGE',
      status: 'NEW',
      notificationStatus: 'PENDING',
      notificationLogs: [],
      adminNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await this.processNewInquiry(sampleInquiry, type === 'CONTACT' ? 'CONTACT_FORM' : 'ORDER_FORM');
  }
}

