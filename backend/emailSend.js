const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Create transporter with IPv4 fix for Render
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true only for 465

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },

  // ✅ Force IPv4 (Fixes ENETUNREACH on Render)
  family: 4,

  tls: {
    rejectUnauthorized: false,
  },

  // ✅ Optional timeouts
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// ✅ Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error.message);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

// ✅ Send Email Function
async function sendMail(to, subject, html, text = "") {
  try {
    const info = await transporter.sendMail({
      from: `"Vinnoshiv" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: text || stripHtml(html),
      html,
    });

    console.log(`✅ Email sent → ${to} | ${subject}`);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error(`❌ Email failed → ${to}:`, error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

// ✅ Convert HTML to plain text fallback
function stripHtml(html) {
  if (!html) return "";

  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ✅ Export functions
module.exports = {
  sendMail,
  stripHtml,
};
