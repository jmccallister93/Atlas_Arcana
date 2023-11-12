// Using NodeMailer for sending emails
const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(userEmail, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  const resetUrl = `http://frontend/reset-password?token=${token}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Password Reset',
    text: `Reset your password by clicking the link: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
}
