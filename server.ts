import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { NotificationEngine } from './src/services/serverNotificationEngine';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

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
      // Security check for production mode
      if (process.env.NODE_ENV === 'production') {
        const secret = process.env.ADMIN_API_SECRET;
        if (!secret) {
          return res.status(503).json({
            success: false,
            error: 'ADMIN_API_SECRET is not configured on the production server.'
          });
        }
        const clientSecret = req.headers['x-admin-secret'];
        if (!clientSecret || clientSecret !== secret) {
          return res.status(401).json({
            success: false,
            error: 'Unauthorized: Invalid or missing x-admin-secret header.'
          });
        }
      }

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

  // 404 handler for any unmatched /api routes (must precede SPA fallback)
  app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `API route ${req.method} ${req.originalUrl} not found` });
  });

  // ----------------------------------------------------
  // VITE & STATIC FILE MIDDLEWARE
  // ----------------------------------------------------

  const isProduction = process.env.NODE_ENV === 'production' || process.argv[1]?.endsWith('server.cjs');

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Robust resolution of distPath across Node.js versions and Hostinger execution directories
    const candidatePaths = [
      path.resolve(process.cwd(), 'dist'),
      path.resolve(__dirname),
      path.resolve(__dirname, 'dist'),
      path.resolve(process.cwd())
    ];

    const distPath = candidatePaths.find((p) => fs.existsSync(path.join(p, 'index.html'))) || path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');

    // Startup check: verify built frontend existence
    if (!fs.existsSync(indexPath)) {
      console.error(`[Server Error] dist/index.html was not found at: ${indexPath}`);
      console.error('[Server Error] Please run "npm run build" to compile frontend assets before starting the production server.');
    } else {
      console.log(`[Server] Serving production static files from: ${distPath}`);
    }

    // Serve static files from the dist directory (index.html, /assets, images, favicon)
    app.use(express.static(distPath));

    // SPA client-side routing fallback:
    // Any non-API, non-asset route (e.g. /, /about, /dashboard, /nonexistent-page) returns dist/index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/assets/')) {
        return next();
      }
      res.sendFile(indexPath, (err) => {
        if (err) {
          next(err);
        }
      });
    });
  }

  // Fallback 404 for unhandled non-HTML requests (e.g., missing assets)
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });

  // Start HTTP server with comprehensive error handling
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (0.0.0.0) [mode: ${isProduction ? 'production' : 'development'}]`);
  });

  // Port binding and runtime error handling
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Error] Port ${PORT} is already in use. Please check running processes or change PORT.`);
    } else if (err.code === 'EACCES') {
      console.error(`[Server Error] Permission denied to bind to port ${PORT}.`);
    } else {
      console.error('[Server Error] Unexpected server error:', err);
    }
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Fatal server startup failure:', err);
  process.exit(1);
});
