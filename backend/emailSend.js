const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

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
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed → ${to}:`, error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { sendMail, stripHtml };
