const express = require('express');
const router = express.Router();
const {
  formatWithMoment,
  getExpirationDate,
  generateSlug,
  findSourceFiles,
  buildSummaryReport
} = require('../services/report.service');
const { sendNotificationEmail } = require('../services/mail.service');

// Generate report summary
router.get('/summary', (req, res) => {
  const title = req.query.title || 'DepLens Security Benchmark Report';
  const report = buildSummaryReport(title, { requestedBy: req.ip });
  return res.json(report);
});

// Scan source files matching pattern
router.get('/files', (req, res) => {
  const pattern = req.query.pattern || '**/*.js';
  const files = findSourceFiles(pattern);
  return res.json({
    pattern,
    totalFiles: files.length,
    files
  });
});

// Send report by email
router.post('/email-notification', async (req, res) => {
  const { recipientEmail, reportTitle } = req.body;
  if (!recipientEmail) {
    return res.status(400).json({ error: 'recipientEmail is required' });
  }

  const report = buildSummaryReport(reportTitle || 'System Audit');
  const emailResult = await sendNotificationEmail({
    to: recipientEmail,
    subject: `Report Notification: ${report.title}`,
    text: `Your report "${report.title}" was generated on ${report.generatedAt}. Slug: ${report.slug}`
  });

  return res.json({
    report,
    emailResult
  });
});

module.exports = router;
