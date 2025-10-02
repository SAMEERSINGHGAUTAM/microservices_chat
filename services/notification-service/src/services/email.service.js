const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// Send email notification
const sendEmailNotification = async (userId, title, content) => {
  try {
    // In a real application, you would fetch user email from database
    // For now, we'll use a placeholder email
    const userEmail = 'user@example.com';
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'notifications@example.com',
      to: userEmail,
      subject: title,
      text: content
    });
    
    console.log('Email notification sent to user:', userId);
  } catch (error) {
    console.error('Email notification error:', error);
    throw new Error('Failed to send email notification: ' + error.message);
  }
};

module.exports = { sendEmailNotification };
