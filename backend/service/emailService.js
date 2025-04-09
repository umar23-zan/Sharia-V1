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

const sendEmail = async (to, subject, html, text) => {
  try {
    const message = await fs.readFile('../Sharia-V1/src/components/emailTemplate.html', 'utf8');
    const mailOptions = {
      from: process.env.EMAIL_FROM, 
      to: to,     
      subject: subject,    
      html: html,                  
      text: text               
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };