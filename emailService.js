// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReferralEmail = (referrerName, referrerEmail, refereeName, refereeEmail, referralMsg) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: refereeEmail,
    subject: 'Referral Notification',
    text: `Hello ${refereeName},\n\nYou have been referred by ${referrerName} (${referrerEmail}).\n\nMessage: ${referralMsg}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendReferralEmail;
