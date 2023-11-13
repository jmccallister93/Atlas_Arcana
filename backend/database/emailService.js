const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(userEmail, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USERNAME, // Use environment variable
      pass: process.env.EMAIL_PASSWORD, // Use environment variable
    },
  });

  const resetUrl = `http://frontend-domain/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Use environment variable
    to: userEmail,
    subject: 'Password Reset',
    text: `Reset your password by clicking the link: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
