import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { NotificationEngine } from './src/services/serverNotificationEngine.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // SERVER API ROUTES (F-08 Production Infrastructure)
  // ----------------------------------------------------

  // 1. Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MK Digitalverse Full-Stack Server Engine',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });

  // 2. Get Notification System Status & Audit Logs
  app.get('/api/notifications/status', (req, res) => {
    try {
      const statusData = NotificationEngine.getNotificationStatus();
      res.json({
        success: true,
        stats: statusData.stats,
        records: statusData.records,
        config: {
          recipientEmail: process.env.NOTIFICATION_RECIPIENT_EMAIL || process.env.INTERNAL_NOTIFICATION_EMAIL || 'mkdigitalverse@gmail.com',
          senderEmail: process.env.NOTIFICATION_SENDER_EMAIL || 'notifications@mkdigitalverse.com',
          hasApiKey: Boolean(process.env.TRANSACTIONAL_EMAIL_API_KEY || process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY)
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // 3. Process Lead Notification Dispatch
  app.post('/api/notifications/process', async (req, res) => {
    try {
      const { leadId, leadType, contactName, organizationName, email, phone, website, healthcareCategory, biggestChallenge, growthObjective, investmentReadiness, customSubject } = req.body;

      if (!leadId || !email || !contactName) {
        return res.status(400).json({ success: false, error: 'Missing required lead fields (leadId, email, contactName)' });
      }

      const formattedSubject = customSubject || `[MK DIGITALVERSE] New Lead Alert - ${organizationName || contactName} (${leadType || 'Enquiry'})`;
      const formattedBody = `
==================================================
NEW HEALTHCARE LEAD INTAKE ALERT (SERVER DISPATCH)
==================================================

CONTACT INFORMATION
--------------------------------------------------
Lead ID        : ${leadId}
Contact Name   : ${contactName}
Organization   : ${organizationName || 'N/A'}
Email Address  : ${email}
Phone Number   : ${phone || 'N/A'}
Website URL    : ${website || 'N/A'}

QUALIFICATION PARAMETERS
--------------------------------------------------
Healthcare Sector : ${healthcareCategory || 'N/A'}
Primary Challenge : ${biggestChallenge || 'N/A'}
Growth Objective  : ${growthObjective || 'N/A'}
Investment Tier   : ${investmentReadiness || 'N/A'}

SYSTEM AUDIT METADATA
--------------------------------------------------
Timestamp      : ${new Date().toISOString()}
Server Agent   : MK Digitalverse Cloud Notification Worker
Server Recipient: ${process.env.NOTIFICATION_RECIPIENT_EMAIL || 'mkdigitalverse@gmail.com'}
==================================================
`;

      const result = await NotificationEngine.queueNotification({
        leadId,
        type: 'lead_intake_alert',
        subject: formattedSubject,
        bodyText: formattedBody,
        idempotencyKey: NotificationEngine.generateIdempotencyKey(leadId, 'lead_intake_alert')
      });

      res.json({
        success: true,
        record: result.record,
        duplicate: result.duplicate,
        message: result.duplicate ? 'Notification was previously processed (idempotent duplicate skipped)' : 'Notification queued and dispatched successfully'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // 4. Retry Failed Notifications
  app.post('/api/notifications/retry', async (req, res) => {
    try {
      const result = await NotificationEngine.retryAllFailed();
      res.json({
        success: true,
        retriedCount: result.retriedCount,
        newlySentCount: result.newlySentCount,
        message: `Retry sequence executed for ${result.retriedCount} records. ${result.newlySentCount} successfully sent.`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // 5. End-to-End Test Dispatch Trigger
  app.post('/api/notifications/test', async (req, res) => {
    try {
      const testLeadId = `test_lead_${Date.now()}`;

      // 1. Dispatch Test Lead Intake Alert
      const intakeRes = await NotificationEngine.queueNotification({
        leadId: testLeadId,
        type: 'test_alert',
        subject: `[SYSTEM E2E TEST] MK Digitalverse Notification Engine Verification`,
        bodyText: `This is an automated end-to-end verification alert dispatched by MK Digitalverse Server Notification Infrastructure at ${new Date().toISOString()}.\n\nAll transactional dispatch rules, envelope headers, and idempotency checks have validated successfully.`,
        idempotencyKey: NotificationEngine.generateIdempotencyKey(testLeadId, 'e2e_test', String(Date.now()))
      });

      // 2. Dispatch Test Revenue Operations Alert
      const revRes = await NotificationEngine.queueNotification({
        leadId: `${testLeadId}_rev`,
        type: 'revenue_alert_overdue',
        subject: `[REVENUE ALERT E2E TEST] Pipeline Action Required - High Value Opportunity`,
        bodyText: `REVENUE OPERATIONS ALERT:\nAn opportunity requires immediate executive review. Follow-up is overdue for strategic account.\n\nTimestamp: ${new Date().toISOString()}`,
        idempotencyKey: NotificationEngine.generateIdempotencyKey(testLeadId, 'rev_e2e_test', String(Date.now()))
      });

      res.json({
        success: true,
        testLeadId,
        intakeResult: intakeRes.record,
        revenueResult: revRes.record,
        message: 'End-to-End notification test sequence executed successfully.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });


  // ----------------------------------------------------
  // VITE & STATIC FILE MIDLLEWARE
  // ----------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MK Digitalverse Server Engine] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
