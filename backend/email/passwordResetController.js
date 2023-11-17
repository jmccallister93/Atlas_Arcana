const User = require('../models/User'); // Adjust the path as needed
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');

// Function to handle password reset request
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  // Generate a token
  const token = crypto.randomBytes(20).toString('hex');
  
  // Save token and expiration in the user record (adjust as per your schema)
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send the password reset email
  await sendPasswordResetEmail(user.email, token);

  res.send({ message: "Password reset email sent" });
};

// Function to reset the password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).send({ error: "Password reset token is invalid or has expired" });
  }

  // Update the user's password
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.send({ message: "Password has been reset" });
};
