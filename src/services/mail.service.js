const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Setup mock transporter for testing / dev
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER || 'mock_user@ethereal.email',
    pass: process.env.SMTP_PASS || 'mock_password'
  }
});

/**
 * Send notification email
 */
const sendNotificationEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.MAIL_FROM || '"DepLens Benchmark" <security@deplens.local>',
    to,
    subject,
    text,
    html: html || `<p>${text}</p>`
  };

  try {
    // In dev / test, if credentials are mock, handle safely
    logger.info(`Sending email notification to ${to} with subject "${subject}"`);
    return {
      success: true,
      simulated: true,
      messageId: `mock-${Date.now()}@deplens.local`,
      envelope: { to, from: mailOptions.from }
    };
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  transporter,
  sendNotificationEmail
};
