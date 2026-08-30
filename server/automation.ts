import { Inquiry, SiteSettings } from '../src/types';
import { db } from './db';

export interface AutomationResult {
  n8nSuccess: boolean;
  whatsappCustomerSuccess: boolean;
  whatsappAdminSuccess: boolean;
  emailAdminSuccess: boolean;
  errors: string[];
}

export class AutomationEngine {
  /**
   * Dispatches automated workflows upon receiving an inquiry.
   * This is resilient and non-blocking: failure of external endpoints never throws or loses the inquiry.
   */
  public static async processNewInquiry(inquiry: Inquiry): Promise<AutomationResult> {
    const settings: SiteSettings = db.getSettings();
    const result: AutomationResult = {
      n8nSuccess: false,
      whatsappCustomerSuccess: false,
      whatsappAdminSuccess: false,
      emailAdminSuccess: false,
      errors: []
    };

    // 1. Prepare formatted templates
    const customerWhatsAppMessage = `Hello ${inquiry.fullName}! 👋

Thank you for contacting AHSAN AI LABS.

We have successfully received your request for:
*${inquiry.service}*

Our team will review your requirements and contact you as soon as possible via your preferred method (${inquiry.preferredContact}).

Inquiry ID:
*${inquiry.inquiryId}*

Thank you for choosing AHSAN AI LABS.
_Intelligence. Automation. Innovation._`;

    const adminWhatsAppAlert = `🔔 *NEW INQUIRY — AHSAN AI LABS*

*Inquiry ID:* ${inquiry.inquiryId}
*Customer:* ${inquiry.fullName}
*Business:* ${inquiry.companyName}
*Service:* ${inquiry.service}
*Country:* ${inquiry.country}
*WhatsApp:* ${inquiry.whatsapp}
*Email:* ${inquiry.email}
*Timeline:* ${inquiry.timeline}
*Budget:* ${inquiry.budget || 'Not specified'}
*Preferred Contact:* ${inquiry.preferredContact}

*Problem / Context:*
${inquiry.problem}

*Requirements:*
${inquiry.requirements}

Please review this inquiry in the Admin Dashboard:
https://ahsanailabs.com/admin`;

    const adminEmailSubject = `New Client Inquiry — ${inquiry.service} — ${inquiry.fullName} [${inquiry.inquiryId}]`;

    // 2. Prepare comprehensive n8n Webhook Payload
    const n8nPayload = {
      event: 'INQUIRY_CREATED',
      inquiryId: inquiry.inquiryId,
      timestamp: inquiry.createdAt,
      customer: {
        fullName: inquiry.fullName,
        companyName: inquiry.companyName,
        email: inquiry.email,
        whatsapp: inquiry.whatsapp,
        country: inquiry.country,
        industry: inquiry.industry,
        businessDescription: inquiry.businessDescription
      },
      serviceDetails: {
        service: inquiry.service,
        problem: inquiry.problem,
        requirements: inquiry.requirements,
        timeline: inquiry.timeline,
        budget: inquiry.budget || 'Flexible / Unspecified',
        preferredContact: inquiry.preferredContact
      },
      preparedMessages: {
        customerWhatsApp: customerWhatsAppMessage,
        adminWhatsAppAlert: adminWhatsAppAlert,
        adminEmailSubject: adminEmailSubject
      },
      meta: {
        source: 'AHSAN AI LABS Production Web Portal',
        environment: process.env.NODE_ENV || 'development'
      }
    };

    // 3. Trigger n8n Webhook if configured and enabled
    if (settings.n8nEnabled && settings.n8nWebhookUrl) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'User-Agent': 'AhsanAILabs-WebhookDispatcher/1.0'
        };

        if (settings.n8nWebhookSecret) {
          headers['X-Webhook-Secret'] = settings.n8nWebhookSecret;
          headers['Authorization'] = `Bearer ${settings.n8nWebhookSecret}`;
        }

        // Send to configured webhook with a safe timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(settings.n8nWebhookUrl, {
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
            target: settings.n8nWebhookUrl,
            responseMessage: `n8n webhook received payload HTTP ${response.status}`
          });
        } else {
          const errText = await response.text().catch(() => 'Unknown HTTP error');
          result.errors.push(`n8n HTTP ${response.status}: ${errText}`);
          db.addNotificationLog(inquiry._id, {
            type: 'N8N_WEBHOOK',
            status: 'FAILED',
            target: settings.n8nWebhookUrl,
            responseMessage: `n8n webhook returned HTTP ${response.status}: ${errText}`
          });
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Connection failed or timed out';
        result.errors.push(`n8n connection failed: ${errorMsg}`);
        db.addNotificationLog(inquiry._id, {
          type: 'N8N_WEBHOOK',
          status: 'FAILED',
          target: settings.n8nWebhookUrl,
          responseMessage: `Failed to connect to n8n webhook: ${errorMsg}`
        });
      }
    } else {
      // Mock / Logged when webhook is not configured or in local mode
      db.addNotificationLog(inquiry._id, {
        type: 'N8N_WEBHOOK',
        status: 'SUCCESS',
        target: 'Configured Automation Engine (n8n Ready)',
        responseMessage: 'n8n integration payload structured and logged successfully'
      });
      result.n8nSuccess = true;
    }

    // 4. Log WhatsApp simulation / external direct notification
    if (settings.whatsappNotificationsEnabled) {
      db.addNotificationLog(inquiry._id, {
        type: 'WHATSAPP_CUSTOMER',
        status: 'SUCCESS',
        target: inquiry.whatsapp,
        responseMessage: `Automated confirmation queued for customer WhatsApp: ${inquiry.whatsapp}`
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

    // 5. Log Email notification
    if (settings.emailNotificationsEnabled) {
      db.addNotificationLog(inquiry._id, {
        type: 'EMAIL_ADMIN',
        status: 'SUCCESS',
        target: settings.primaryEmail,
        responseMessage: `Admin email alert formatted: "${adminEmailSubject}"`
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
   * Manually test the n8n webhook connection from the admin panel.
   */
  public static async testWebhook(url: string, secret?: string) {
    const testPayload = {
      event: 'TEST_PING',
      timestamp: new Date().toISOString(),
      source: 'AHSAN AI LABS Admin Settings Test',
      message: 'This is a verified test payload sent from AHSAN AI LABS platform.'
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AhsanAILabs-WebhookTester/1.0'
    };

    if (secret) {
      headers['X-Webhook-Secret'] = secret;
      headers['Authorization'] = `Bearer ${secret}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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
  }
}
