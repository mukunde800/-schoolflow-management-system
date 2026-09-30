const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false,
  auth: env.mail.user ? { user: env.mail.user, pass: env.mail.password } : undefined,
});

exports.sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({ from: `"SchoolFlow" <${env.mail.user}>`, to, subject, html });
};

exports.sendWelcomeEmail = (user) =>
  exports.sendMail({
    to: user.email,
    subject: 'Bienvenue sur SchoolFlow',
    html: `<h2>Bonjour ${user.firstName},</h2><p>Votre compte a été créé avec succès.</p>`,
  });