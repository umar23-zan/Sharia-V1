const nodemailer = require('nodemailer');
const fs = require('fs').promises

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});
/**
 * Sends an email.
 * @param {string} to Recipient email address.
 * @param {string} subject Email subject.
 * @param {string} html Email body (HTML).
 * @param {string} [text] Optional plain text version of the email body.
 */
const sendEmail = async (to, subject, html, text) => {
  try {
    const message = await fs.readFile('../Sharia-V1/src/components/emailTemplate.html', 'utf8');
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address from .env
      to: to,                      // List of receivers
      subject: subject,            // Subject line
      html: message,                  // HTML body
      text: text                   // Plain text body (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };