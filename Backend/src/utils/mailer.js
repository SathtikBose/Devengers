const { Resend } = require("resend");

/**
 * 📧 Mailer Utility (using Resend)
 * Handles sending verification codes and system notifications.
 */
exports.sendMail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("❌ RESEND_API_KEY is missing in backend/.env");
    throw new Error("Email service is not configured.");
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: `NutriScan <${from}>`,
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw new Error(error.message || "Failed to send email via Resend.");
    }

    return data;
  } catch (err) {
    console.error("❌ Mailer Exception:", err);
    throw err;
  }
};

