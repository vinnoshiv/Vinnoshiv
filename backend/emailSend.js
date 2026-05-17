const getInbox = async (req, res) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    return res.json({
      emails: [],
      configured: false,
      error: "Gmail credentials not configured.",
    });
  }

  try {
    const { ImapFlow } = require("imapflow");
    const { simpleParser } = require("mailparser");

const client = new ImapFlow({
  host: "imap.gmail.com",
  port: 993,
  secure: true,

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },

  logger: false,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    const emails = [];

    try {
      const status = await client.status("INBOX", { messages: true });
      const total = status.messages || 0;

      if (total === 0) {
        return res.json({ emails: [], configured: true });
      }

      const start = Math.max(1, total - 29); // Last 30 emails
      const range = `${start}:${total}`;

      for await (const msg of client.fetch(range, {
        envelope: true,
        bodyStructure: true,
        flags: true,
        source: true,
      })) {
        let parsedEmail = null;
        try {
          parsedEmail = await simpleParser(msg.source);
        } catch (parseErr) {
          console.error("Parse error for msg", msg.seq, parseErr.message);
        }

        // ✅ Generate avatar color from email string
        const fromEmail =
          msg.envelope.from?.[0]?.address || "unknown@email.com";
        const fromName = msg.envelope.from?.[0]?.name || "";
        const avatarColor = generateAvatarColor(fromEmail);
        const initials = getInitials(fromName || fromEmail);

        // ✅ Get plain text — strip quoted replies
        let textPlain = parsedEmail?.text || "";
        if (textPlain) {
          // Remove quoted email content (lines starting with >)
          textPlain = textPlain
            .split("\n")
            .filter((line) => !line.trim().startsWith(">"))
            .join("\n")
            .trim();
        }

        const emailData = {
          uid: msg.uid,
          seq: msg.seq,
          from: fromEmail,
          fromName: fromName,
          initials: initials,
          avatarColor: avatarColor,
          subject: msg.envelope.subject || "(No Subject)",
          date: msg.envelope.date || new Date().toISOString(),
          seen: msg.flags.has("\\Seen"),
          html: parsedEmail?.html || "",
          textPlain: textPlain,
          hasAttachments: parsedEmail?.attachments?.length > 0 || false,
          attachmentCount: parsedEmail?.attachments?.length || 0,
        };

        emails.push(emailData);
      }
    } finally {
      lock.release();
    }

    await client.logout();

    // Sort newest first
    emails.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ emails, configured: true });
  } catch (err) {
    console.error("IMAP error:", err.message);
    res.json({
      emails: [],
      configured: false,
      error: `IMAP error: ${err.message}`,
    });
  }
};

// ✅ Generate consistent color from email string
function generateAvatarColor(email) {
  const colors = [
    "#0284c7", // blue
    "#7c3aed", // purple
    "#059669", // green
    "#dc2626", // red
    "#d97706", // amber
    "#0891b2", // cyan
    "#be185d", // pink
    "#65a30d", // lime
    "#7c2d12", // brown
    "#1d4ed8", // indigo
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ✅ Get initials from name or email
function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "?";
  const clean = nameOrEmail.split("@")[0]; // handle emails
  const parts = clean.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

module.exports = { getInbox };
