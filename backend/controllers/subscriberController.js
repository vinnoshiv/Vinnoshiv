const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../emailSend");

const subscribe = async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ message: "You have been re-subscribed! Welcome back." });
      }
      return res.status(409).json({ message: "You are already subscribed!" });
    }

    const subscriber = await Subscriber.create({ email, name: name || "", consentGiven: true });

    try {
      await sendMail(
        email,
        "Welcome to Vinnoshiv Newsletter! 🎉",
        `<div style="font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#0284c7;margin:0;">Welcome to Vinnoshiv!</h1>
          </div>
          <p style="color:#334155;font-size:16px;">You're now subscribed to our newsletter. We'll keep you updated on:</p>
          <ul style="color:#334155;font-size:15px;line-height:1.8;">
            <li>New automation tools &amp; bots</li>
            <li>Exclusive discounts for subscribers</li>
            <li>Automation tips &amp; tutorials</li>
          </ul>
          <p style="color:#64748b;font-size:13px;margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px;">
            You can unsubscribe at any time. — Vinnoshiv Team
          </p>
        </div>`
      );
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr.message);
    }

    res.status(201).json({ message: "Successfully subscribed! Check your inbox for a welcome email.", subscriber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleSubscriber = async (req, res) => {
  try {
    const sub = await Subscriber.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscriber not found" });
    sub.active = !sub.active;
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: "Subscriber removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendEmailToSubscribers = async (req, res) => {
  const { subject, html, recipientIds } = req.body;
  if (!subject || !html) return res.status(400).json({ message: "Subject and content are required." });

  try {
    let query = { active: true };
    if (recipientIds && recipientIds.length > 0) {
      query = { _id: { $in: recipientIds } };
    }

    const subscribers = await Subscriber.find(query);
    if (subscribers.length === 0) return res.status(400).json({ message: "No subscribers found." });

    const results = [];
    for (const sub of subscribers) {
      try {
        await sendMail(sub.email, subject, html);
        results.push({ email: sub.email, success: true });
      } catch (err) {
        results.push({ email: sub.email, success: false, error: err.message });
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    res.json({ message: `Sent to ${sent} subscriber(s). ${failed} failed.`, sent, failed, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { subscribe, getSubscribers, toggleSubscriber, deleteSubscriber, sendEmailToSubscribers };
