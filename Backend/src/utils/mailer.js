async function createTransporter() {
  let nodemailer;

  try {
    nodemailer = require("nodemailer");
  } catch (error) {
    const dependencyError = new Error(
      'Missing "nodemailer". Run "npm install nodemailer" in the backend folder.',
    );
    dependencyError.status = 500;
    throw dependencyError;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    MAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    const configError = new Error(
      "SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in backend/.env.",
    );
    configError.status = 500;
    throw configError;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

exports.sendMail = async ({ to, subject, html, text }) => {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};
