const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on this link: ${process.env.CLIENT_URL}/verify/${token}`,
      html: `<p>Please verify your email by clicking on this link: <a href="${process.env.CLIENT_URL}/verify/${token}">Verify Email</a></p>`
    });
    
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Password Reset',
      text: `Please reset your password by clicking on this link: ${process.env.CLIENT_URL}/reset/${token}`,
      html: `<p>Please reset your password by clicking on this link: <a href="${process.env.CLIENT_URL}/reset/${token}">Reset Password</a></p>`
    });
    
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
