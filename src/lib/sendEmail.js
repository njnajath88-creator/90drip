import nodemailer from "nodemailer";

/**
 * Send an email via Nodemailer SMTP or log in dev mode if credentials are unset.
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    if (!to) {
      console.warn("[Email Service] Recipient email is missing. Skipping email.");
      return { success: false, reason: "No recipient email" };
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `"90DRIP Streetwear" <${user || "orders@90drip.com"}>`;

    // If SMTP is fully configured, send live email
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587 / other ports
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: text || "90DRIP Order Notification",
      });

      console.log(`[Email Service] Live email sent to ${to}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }

    // Dev Mode Fallback: Log email details when SMTP is not configured
    console.log(`\n=================== 📧 90DRIP EMAIL DISPATCH (DEV MODE) ===================`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`FROM: ${from}`);
    console.log(`NOTE: Add SMTP_HOST, SMTP_USER, SMTP_PASS to .env.local for live email delivery.`);
    console.log(`=========================================================================\n`);

    return { success: true, devMode: true };
  } catch (error) {
    console.error("[Email Service Error] Failed to send email:", error);
    return { success: false, error: error.message };
  }
}
