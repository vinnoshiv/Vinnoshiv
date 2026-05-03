const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const fs = require("fs");
const dotenv = require("dotenv");
const https = require("https");
const axios = require("axios");
const mongoose = require("mongoose");
const { Readable } = require("stream");

dotenv.config();

// Configuration
const API_ID = 29810535;
const API_HASH = "706d82269865c6fb915679b48b41fe89";
const BOT_TOKEN = "8568528100:AAHl1yQlmGPBwYzqBnT4ifE_OHjpYesfu6s";
const OWNER_ID = 6713397633;

// MongoDB
const dbConnection = mongoose.createConnection("mongodb+srv://jiophnox_db_user:XXH4fWhGCgXIOa1b@cluster0.eewfimt.mongodb.net/?appName=Cluster0");
dbConnection.on("connected", () => console.log("✅ MongoDB Connected"));

const RumbleVideo = dbConnection.model(
  "RumbleVideo",
  new mongoose.Schema({
    videoId: String,
    title: String,
    rumbleUrl: String,
    embedCode: String,
    hlsUrl: String,
    fileSize: Number,
    quality: {
      type: Map,
      of: String,
    },
    createdAt: { type: Date, default: Date.now },
  }),
);

// Replace the UploadQueue and add FailedQueue schema

const UploadQueue = dbConnection.model(
  "UploadQueue",
  new mongoose.Schema({
    messageId: { type: Number, required: true },
    channelId: { type: Number, required: true },
    fileName: String,
    fileSize: Number,
    addedAt: { type: Date, default: Date.now },
    retryCount: { type: Number, default: 0 },
  }),
);

// Compound unique index
UploadQueue.collection
  .createIndex({ messageId: 1, channelId: 1 }, { unique: true })
  .catch(() => {});

const FailedQueue = dbConnection.model(
  "FailedQueue",
  new mongoose.Schema({
    messageId: { type: Number, required: true },
    channelId: { type: Number, required: true },
    fileName: String,
    fileSize: Number,
    error: String,
    failedAt: { type: Date, default: Date.now },
  }),
);

FailedQueue.collection
  .createIndex({ messageId: 1, channelId: 1 }, { unique: true })
  .catch(() => {});

const WatchChannel = dbConnection.model(
  "WatchChannel",
  new mongoose.Schema({
    channelId: { type: Number, unique: true, required: true },
    channelName: { type: String, default: "" },
    channelUsername: { type: String, default: "" },
    addedAt: { type: Date, default: Date.now },
    addedBy: { type: Number },
    isActive: { type: Boolean, default: true },
  }),
);

// Constants
const CHUNK_SIZE = 1024 * 1024; // 1MB
const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB
const RUMBLE_SERVERS = [
  "web18.rumble.com",
  "web19.rumble.com",
  "web20.rumble.com",
];
const MAX_RETRIES = 3;
// const PROGRESS_UPDATE_INTERVAL = 5; // Update every 5%

// State
const pendingMediaGroups = new Map();
const processedIds = new Set();
let isProcessing = false;
let currentMsgId = null;
let progressMsgId = null; // Single message ID for editing
let lastReportedPercent = -1; // Track last reported percentage
let watchChannelIds = new Set();

// Sender cache
const senderCache = new Map();

// Batch collection for incoming files
const pendingBatchFiles = new Map(); // channelId -> { files: [], timeout: null }
const BATCH_WAIT_TIME = 3000; // Wait 3 seconds after last file

// Telegram Client
const client = new TelegramClient(
  new StringSession(
    fs.existsSync("session.txt")
      ? fs.readFileSync("session.txt", "utf-8").trim()
      : "",
  ),
  API_ID,
  API_HASH,
  {
    connectionRetries: 10,
    autoReconnect: true,
    retryDelay: 1000,
    timeout: 120000,
    requestRetries: 5,
  },
);

// Helper Functions
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const formatBytes = (b) => {
  if (b === 0) return "0 B";
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB"][i]}`;
};

// Cached sender
async function getCachedSender(dcId) {
  const cacheKey = `dc_${dcId}`;

  if (senderCache.has(cacheKey)) {
    const cached = senderCache.get(cacheKey);
    const age = Date.now() - cached.timestamp;

    if (age < 300000 && cached.sender._connected) {
      return cached.sender;
    }

    try {
      await cached.sender.disconnect();
    } catch (e) {}
    senderCache.delete(cacheKey);
  }

  console.log(`🔌 Getting new sender for DC ${dcId}...`);
  const sender = await client.getSender(dcId);

  senderCache.set(cacheKey, {
    sender,
    timestamp: Date.now(),
  });

  return sender;
}

async function clearSenderCache() {
  for (const [key, cached] of senderCache) {
    try {
      await cached.sender.disconnect();
    } catch (e) {}
  }
  senderCache.clear();
}

function getFileUniqueId(msg) {
  const doc = msg.media?.document;
  return doc ? `doc_${doc.id}` : `msg_${msg.id}`;
}

function isVideoFile(msg) {
  const doc = msg.media?.document;
  if (!doc) return false;
  if (doc.mimeType?.startsWith("video/")) return true;
  return doc.attributes?.some(
    (a) =>
      a.className === "DocumentAttributeVideo" ||
      (a.fileName &&
        ["mp4", "mkv", "webm", "avi", "mov"].includes(
          a.fileName.split(".").pop()?.toLowerCase(),
        )),
  );
}

function getFileInfo(msg) {
  const doc = msg.media?.document;
  if (!doc) return { fileName: "file", fileSize: 0 };
  let fileName =
    doc.attributes?.find((a) => a.fileName)?.fileName || `video_${msg.id}.mp4`;
  return { fileName, fileSize: Number(doc.size) };
}

async function getFileProps(msgId, channelId) {
  const msgs = await client.getMessages(channelId, { ids: [msgId] });
  if (!msgs?.[0]?.media) throw new Error("File not found");
  const doc = msgs[0].media.document;
  return {
    inputLocation: new Api.InputDocumentFileLocation({
      id: doc.id,
      accessHash: doc.accessHash,
      fileReference: doc.fileReference,
      thumbSize: "",
    }),
    dcId: doc.dcId,
    fileSize: Number(doc.size),
    mimeType: doc.mimeType || "video/mp4",
  };
}

function isRetryableError(error) {
  const msg = error.message?.toLowerCase() || "";
  return (
    msg.includes("econnreset") ||
    msg.includes("socket hang up") ||
    msg.includes("etimedout") ||
    msg.includes("econnrefused") ||
    msg.includes("network") ||
    msg.includes("timeout") ||
    msg.includes("not connected") ||
    msg.includes("hanging") ||
    msg.includes("flood")
  );
}

// Load watch channels
async function loadWatchChannels() {
  try {
    const channels = await WatchChannel.find({ isActive: true });
    watchChannelIds.clear();
    channels.forEach((ch) => watchChannelIds.add(ch.channelId));
    console.log(`📺 Loaded ${watchChannelIds.size} watch channels`);
    return channels;
  } catch (e) {
    console.error("Failed to load watch channels:", e.message);
    return [];
  }
}

async function getChannelInfo(channelInput) {
  try {
    let entity;
    if (/^-?\d+$/.test(channelInput)) {
      entity = await client.getEntity(parseInt(channelInput));
    } else {
      const username = channelInput.replace(/^@/, "");
      entity = await client.getEntity(username);
    }

    if (entity) {
      const channelId = entity.id ? -Number(`100${entity.id}`) : null;
      return {
        success: true,
        channelId: channelId || parseInt(channelInput),
        title: entity.title || entity.firstName || "Unknown",
        username: entity.username || "",
      };
    }
  } catch (e) {
    console.error("Get channel info error:", e.message);
  }

  if (/^-?\d+$/.test(channelInput)) {
    return {
      success: true,
      channelId: parseInt(channelInput),
      title: "Unknown Channel",
      username: "",
    };
  }
  return { success: false, error: "Channel not found" };
}

async function addWatchChannel(channelInput, addedBy) {
  const info = await getChannelInfo(channelInput);
  if (!info.success) {
    return {
      success: false,
      message: "❌ Channel not found. Use channel ID or @username",
    };
  }

  const existing = await WatchChannel.findOne({ channelId: info.channelId });
  if (existing) {
    if (existing.isActive) {
      return {
        success: false,
        message: `⚠️ Channel already added:\n📺 ${existing.channelName || existing.channelId}`,
      };
    }
    existing.isActive = true;
    existing.channelName = info.title;
    existing.channelUsername = info.username;
    await existing.save();
    watchChannelIds.add(info.channelId);
    return {
      success: true,
      message: `✅ Channel reactivated:\n📺 ${info.title}\n🆔 \`${info.channelId}\``,
    };
  }

  await WatchChannel.create({
    channelId: info.channelId,
    channelName: info.title,
    channelUsername: info.username,
    addedBy: addedBy,
  });

  watchChannelIds.add(info.channelId);
  return {
    success: true,
    message: `✅ Channel added!\n\n📺 **Name:** ${info.title}\n🆔 **ID:** \`${info.channelId}\`${info.username ? `\n👤 @${info.username}` : ""}`,
  };
}

async function removeWatchChannel(channelInput) {
  let channelId;
  if (/^-?\d+$/.test(channelInput)) {
    channelId = parseInt(channelInput);
  } else {
    const info = await getChannelInfo(channelInput);
    if (!info.success)
      return { success: false, message: "❌ Channel not found" };
    channelId = info.channelId;
  }

  const channel = await WatchChannel.findOne({ channelId });
  if (!channel)
    return { success: false, message: "❌ Channel not in watch list" };

  channel.isActive = false;
  await channel.save();
  watchChannelIds.delete(channelId);

  return {
    success: true,
    message: `✅ Channel removed!\n\n📺 ${channel.channelName || "Unknown"}\n🆔 \`${channelId}\``,
  };
}

async function listWatchChannels() {
  const channels = await WatchChannel.find({ isActive: true }).sort({
    addedAt: -1,
  });
  if (channels.length === 0) {
    return "📭 **No channels configured**\n\nUse `/addchannel <id or @username>` to add";
  }

  let msg = `📺 **Watch Channels (${channels.length})**\n\n`;
  channels.forEach((ch, i) => {
    msg += `**${i + 1}.** ${ch.channelName || "Unknown"}\n`;
    msg += `   🆔 \`${ch.channelId}\`\n`;
    if (ch.channelUsername) msg += `   👤 @${ch.channelUsername}\n`;
    msg += `\n`;
  });
  return msg;
}

// Remove the old constant
// const PROGRESS_UPDATE_INTERVAL = 5; // DELETE THIS LINE

// Add this new function to get dynamic interval based on file size
function getProgressInterval(fileSize) {
  const sizeInMB = fileSize / (1024 * 1024);

  if (sizeInMB < 100) {
    return 50; // < 100MB: update at 50% only
  } else if (sizeInMB < 200) {
    return 20; // 100-200MB: update every 20%
  } else if (sizeInMB < 500) {
    return 10; // 200-500MB: update every 10%
  } else {
    return 5; // > 500MB: update every 5%
  }
}

// ============ PROGRESS UPDATE - EDIT SAME MESSAGE ============
// ============ PROGRESS UPDATE - EDIT SAME MESSAGE ============
async function updateProgress(
  fileName,
  fileSize,
  tgPercent,
  rumblePercent,
  status = "uploading",
  bufferInfo = "",
) {
  if (!OWNER_ID) return;

  // For uploading status, only update at dynamic intervals based on file size
  if (status === "uploading") {
    const interval = getProgressInterval(fileSize);
    const currentStep = Math.floor(rumblePercent / interval) * interval;

    if (currentStep === lastReportedPercent && progressMsgId) {
      return; // Skip update, same step
    }
    lastReportedPercent = currentStep;
  }

  const progressBar = (percent) => {
    const filled = Math.floor(percent / 5); // 20 blocks total
    const empty = 20 - filled;
    return "▓".repeat(filled) + "░".repeat(empty);
  };

  // Get interval info for display
  const interval = getProgressInterval(fileSize);
  const sizeCategory =
    fileSize < 100 * 1024 * 1024
      ? "< 100MB"
      : fileSize < 200 * 1024 * 1024
        ? "100-200MB"
        : fileSize < 500 * 1024 * 1024
          ? "200-500MB"
          : "> 500MB";

  let text;
  if (status === "uploading") {
    text =
      `📤 **Uploading to Rumble**\n\n` +
      `📁 \`${fileName}\`\n` +
      `📦 ${formatBytes(fileSize)} (${sizeCategory})\n\n` +
      `📥 **TG Download:** ${tgPercent}%\n` +
      `${progressBar(tgPercent)}\n\n` +
      `📤 **Rumble Upload:** ${rumblePercent}%\n` +
      `${progressBar(rumblePercent)}\n\n` +
      `🔄 Update interval: ${interval}%`;
    if (bufferInfo) text += `\n💾 Buffer: ${bufferInfo}`;
  } else if (status === "success") {
    text = `✅ **Upload Complete!**\n\n📁 \`${fileName}\`\n📦 ${formatBytes(fileSize)}`;
  } else if (status === "skipped") {
    text = `⏭️ **Skipped (Duplicate)**\n\n📁 \`${fileName}\``;
  } else if (status === "starting") {
    const interval = getProgressInterval(fileSize);
    text = `🚀 **Starting Upload**\n\n📁 \`${fileName}\`\n📦 ${formatBytes(fileSize)} (${sizeCategory})\n\n⏳ Connecting...\n🔄 Progress updates: every ${interval}%`;
  } else if (status === "buffering") {
    text = `📦 **Buffering...**\n\n📁 \`${fileName}\`\n📦 ${formatBytes(fileSize)}\n\n💾 Buffer: ${bufferInfo}`;
  } else if (status === "processing") {
    text = `⚙️ **Processing on Rumble...**\n\n📁 \`${fileName}\`\n📦 ${formatBytes(fileSize)}\n\n⏳ Please wait...`;
  } else if (status === "retrying") {
    text = `🔄 **Retrying Upload**\n\n📁 \`${fileName}\`\n📦 ${formatBytes(fileSize)}\n\n${bufferInfo}`;
  } else {
    text = `❌ **Upload Failed!**\n\n📁 \`${fileName}\`\n\n❌ Error: ${status}`;
  }

  try {
    if (progressMsgId) {
      await client.editMessage(OWNER_ID, {
        message: progressMsgId,
        text,
        parseMode: "markdown",
      });
    } else {
      const sent = await client.sendMessage(OWNER_ID, {
        message: text,
        parseMode: "markdown",
      });
      progressMsgId = sent.id;
    }
  } catch (e) {
    if (e.message?.includes("MESSAGE_NOT_MODIFIED")) {
      return;
    }
    try {
      const sent = await client.sendMessage(OWNER_ID, {
        message: text,
        parseMode: "markdown",
      });
      progressMsgId = sent.id;
    } catch (e2) {
      console.error("Progress update failed:", e2.message);
    }
  }
}

// Reset progress state for new upload
function resetProgressState() {
  progressMsgId = null;
  lastReportedPercent = -1;
}

// Rumble Functions
function getRumbleCookies() {
  return {
    u_s: process.env.RUMBLE_U_S || "",
    a_s: process.env.RUMBLE_A_S || "",
  };
}

function buildCookieString(c) {
  return Object.entries(c)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

// ============ STREAMING STATE CLASS ============
class StreamingState {
  constructor(fileSize) {
    this.buffer = [];
    this.bufferSize = 0;
    this.downloaded = 0;
    this.uploaded = 0;
    this.finished = false;
    this.error = null;
    this.startTime = Date.now();
    this.fileSize = fileSize;
    this.waitingForBuffer = null;
    this.waitingForSpace = null;
    this.lastLogPercent = -1; // Changed to -1 to ensure first log at 0%
    this.progressInterval = getProgressInterval(fileSize); // Store interval
  }

  async addChunk(chunk) {
    while (this.bufferSize >= MAX_BUFFER_SIZE && !this.error) {
      await new Promise((resolve) => {
        this.waitingForSpace = resolve;
        setTimeout(resolve, 100);
      });
    }

    if (this.error) throw this.error;

    this.buffer.push(chunk);
    this.bufferSize += chunk.length;
    this.downloaded += chunk.length;

    if (this.waitingForBuffer) {
      this.waitingForBuffer();
      this.waitingForBuffer = null;
    }
  }

  async getChunk() {
    while (this.buffer.length === 0 && !this.finished && !this.error) {
      await new Promise((resolve) => {
        this.waitingForBuffer = resolve;
        setTimeout(resolve, 100);
      });
    }

    if (this.error) throw this.error;
    if (this.buffer.length === 0) return null;

    const chunk = this.buffer.shift();
    this.bufferSize -= chunk.length;

    if (this.waitingForSpace) {
      this.waitingForSpace();
      this.waitingForSpace = null;
    }

    return chunk;
  }

  finish() {
    this.finished = true;
    if (this.waitingForBuffer) {
      this.waitingForBuffer();
      this.waitingForBuffer = null;
    }
  }

  setError(err) {
    this.error = err;
    if (this.waitingForBuffer) this.waitingForBuffer();
    if (this.waitingForSpace) this.waitingForSpace();
  }

  // Check if should log (every 5%)
  shouldLog() {
    const currentPercent = Math.floor((this.uploaded / this.fileSize) * 100);
    const currentStep =
      Math.floor(currentPercent / this.progressInterval) *
      this.progressInterval;

    if (currentStep > this.lastLogPercent) {
      this.lastLogPercent = currentStep;
      return true;
    }
    return false;
  }
}

// ============ MAIN UPLOAD FUNCTION ============
async function uploadToRumble(msgId, channelId, fileName, fileSize, title) {
  const cookies = getRumbleCookies();
  if (!cookies.u_s || !cookies.a_s)
    throw new Error("Rumble cookies not configured");

  const { inputLocation, dcId, mimeType } = await getFileProps(
    msgId,
    channelId,
  );
  const server =
    RUMBLE_SERVERS[Math.floor(Math.random() * RUMBLE_SERVERS.length)];
  const boundary = `----WebKitFormBoundary${Math.random().toString(36).substr(2)}`;

  const safeFileName =
    fileName
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[<>:"/\\|?*]/g, "_")
      .trim() || `video-${Date.now()}.mp4`;
  const encodedFileName = encodeURIComponent(fileName);

  const header = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="Filedata"; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}\r\n` +
      `Content-Type: application/octet-stream\r\n\r\n`,
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);

  console.log(
    `\n📤 [Streaming] ${fileName} (${formatBytes(fileSize)}) → ${server}`,
  );

  // Reset progress state
  resetProgressState();
  await updateProgress(fileName, fileSize, 0, 0, "starting");

  const state = new StreamingState(fileSize);
  const sender = await getCachedSender(dcId);

  return new Promise(async (resolve, reject) => {
    let uploadFinished = false;

    const timeoutMs = Math.max(3600000, (fileSize / (1024 * 1024)) * 60000);
    console.log(`⏱️ Timeout: ${Math.round(timeoutMs / 60000)} min`);

    const uploadTimeout = setTimeout(() => {
      if (!uploadFinished) {
        state.setError(new Error("Upload timeout"));
        reject(new Error("Upload timeout"));
      }
    }, timeoutMs);

    const agent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 30000,
      maxSockets: 1,
      timeout: 300000,
    });

    // Download task
    const downloadTask = async () => {
      let offset = 0;
      let consecutiveErrors = 0;

      while (offset < fileSize) {
        if (state.error) break;

        try {
          const result = await sender.send(
            new Api.upload.GetFile({
              location: inputLocation,
              offset: BigInt(offset),
              limit: CHUNK_SIZE,
            }),
          );

          if (!result.bytes?.length) break;

          const chunk = Buffer.from(result.bytes);
          await state.addChunk(chunk);
          offset += chunk.length;
          consecutiveErrors = 0;
        } catch (e) {
          if (e.seconds) {
            console.log(`⏳ FloodWait: ${e.seconds}s`);
            await sleep(e.seconds * 1000);
            continue;
          }

          consecutiveErrors++;
          if (consecutiveErrors >= 5) {
            state.setError(new Error(`Download failed: ${e.message}`));
            break;
          }

          if (isRetryableError(e)) {
            senderCache.delete(`dc_${dcId}`);
            await sleep(3000);
          }
          await sleep(2000 * consecutiveErrors);
        }
      }

      state.finish();
      console.log(`✅ TG Download complete: ${formatBytes(state.downloaded)}`);
    };

    // Upload stream
    const createUploadStream = () => {
      const stream = new Readable({
        async read() {
          try {
            if (!this._headerSent) {
              this._headerSent = true;
              this.push(header);
              return;
            }

            if (!this._bufferReady) {
              const bufferTarget = Math.min(MAX_BUFFER_SIZE, fileSize * 0.1);
              await updateProgress(
                fileName,
                fileSize,
                0,
                0,
                "buffering",
                formatBytes(bufferTarget),
              );

              while (
                state.bufferSize < bufferTarget &&
                !state.finished &&
                !state.error
              ) {
                await sleep(100);
              }

              if (state.error) {
                this.destroy(state.error);
                return;
              }

              this._bufferReady = true;
              console.log(`📦 Buffer ready: ${formatBytes(state.bufferSize)}`);
            }

            const chunk = await state.getChunk();

            if (chunk === null) {
              this.push(footer);
              this.push(null);
              return;
            }

            state.uploaded += chunk.length;
            this.push(chunk);

            // Log and update progress every 5%
            if (state.shouldLog()) {
              const dlPercent = Math.round((state.downloaded / fileSize) * 100);
              const ulPercent = Math.round((state.uploaded / fileSize) * 100);
              const bufferInfo = formatBytes(state.bufferSize);

              console.log(
                `📥 TG: ${dlPercent}% | 📤 Rumble: ${ulPercent}% | Buffer: ${bufferInfo}`,
              );
              await updateProgress(
                fileName,
                fileSize,
                dlPercent,
                ulPercent,
                "uploading",
                bufferInfo,
              );
            }
          } catch (e) {
            this.destroy(e);
          }
        },
      });

      stream._headerSent = false;
      stream._bufferReady = false;
      return stream;
    };

    // Start download
    const downloadPromise = downloadTask();

    // Start upload
    const req = https.request(
      {
        hostname: server,
        port: 443,
        path: "/upload.php?api=1.3",
        method: "POST",
        agent: agent,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": header.length + fileSize + footer.length,
          Accept: "*/*",
          Origin: "https://rumble.com",
          Referer: "https://rumble.com/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Cookie: buildCookieString(cookies),
          Connection: "keep-alive",
        },
      },
      async (res) => {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", async () => {
          uploadFinished = true;
          clearTimeout(uploadTimeout);
          agent.destroy();

          await downloadPromise;

          console.log(`📥 Rumble status: ${res.statusCode}`);

          const match = body.match(/0-[a-z0-9]+\.[a-z0-9]+/i);
          if (!match) {
            console.log(`❌ Response: ${body.substring(0, 300)}`);
            return reject(new Error("Upload failed - no filename"));
          }

          console.log(`✅ Uploaded: ${match[0]}`);
          await updateProgress(fileName, fileSize, 100, 100, "processing");

          // Submit form
          const formData = new URLSearchParams({
            title,
            description: "",
            "video[]": match[0],
            rights: "1",
            terms: "1",
            visibility: "private",
            availability: "free",
            tags: "",
            channelId: "undefined",
            siteChannelId: process.env.SITE_CHANNEL_ID || "9",
            mediaChannelId: process.env.MEDIA_CHANNEL_ID || "0",
            file_meta: JSON.stringify({
              name: fileName,
              modified: Date.now(),
              size: fileSize,
              type: mimeType,
              time_start: state.startTime,
              time_end: Date.now(),
            }),
          });

          const fileSizeGB = fileSize / (1024 * 1024 * 1024);
          const formTimeout = Math.min(
            900000,
            Math.max(180000, 180000 + fileSizeGB * 60000),
          );

          try {
            const formRes = await axios.post(
              `https://${server}/upload.php?form=1&api=1.3`,
              formData.toString(),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Cookie: buildCookieString(cookies),
                },
                timeout: formTimeout,
              },
            );

            const urlMatch = formRes.data.match(/url:\s*"([^"]+)"/);
            const fidMatch = formRes.data.match(/fid:\s*(\d+)/);
            const embedMatch = formRes.data.match(
              /https:\/\/rumble\.com\/embed\/[^"\\]+/,
            );

            if (urlMatch) {
              resolve({
                success: true,
                videoUrl: urlMatch[1],
                videoId: fidMatch?.[1],
                embedCode: embedMatch?.[0]?.replace(/\\\//g, "/"),
              });
            } else {
              const errorMatch = formRes.data.match(
                /setErrors\s*\(\s*\{[^}]*"([^"]+)"\s*\}/,
              );
              const errorMsg = errorMatch?.[1] || "";

              if (
                errorMsg.includes("Duplicate") ||
                formRes.data.includes("Duplicate")
              ) {
                reject(new Error("DUPLICATE"));
              } else {
                reject(new Error(errorMsg || "Form failed"));
              }
            }
          } catch (e) {
            reject(e);
          }
        });
      },
    );

    req.on("error", async (e) => {
      clearTimeout(uploadTimeout);
      agent.destroy();
      state.setError(e);
      await downloadPromise.catch(() => {});
      reject(e);
    });

    const uploadStream = createUploadStream();
    uploadStream.on("error", (e) => {
      clearTimeout(uploadTimeout);
      agent.destroy();
      state.setError(e);
      req.destroy();
      reject(e);
    });

    uploadStream.pipe(req);
  });
}

// Edit Caption
// Edit Caption with Button - FULLY FIXED
async function editCaption(msgId, channelId, videoId) {
  const watchUrl = `https://jiohotstar.rf.gd/ADL?id=${videoId}`;

  // Get original message caption
  let originalCaption = "";
  try {
    const msgs = await client.getMessages(channelId, { ids: [msgId] });
    if (!msgs?.[0]) {
      console.log(`⚠️ Message ${msgId} not found`);
      return false;
    }
    originalCaption = msgs[0].message || "";
  } catch (e) {
    console.log(`⚠️ Failed to get message: ${e.message}`);
  }

  const newCaption = originalCaption + `\n\n▶️ Watch: ${watchUrl}`;

  // Method 1: Bot API with inline button (MOST RELIABLE)
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`,
      {
        chat_id: channelId,
        message_id: msgId,
        caption: newCaption,
        reply_markup: JSON.stringify({
          inline_keyboard: [[{ text: "▶️ Watch Now", url: watchUrl }]],
        }),
      },
    );

    if (res.data?.ok) {
      console.log(`✅ Caption & button added: ${msgId}`);
      return true;
    }
  } catch (e) {
    const errMsg = e.response?.data?.description || e.message;
    console.log(`⚠️ Bot API with button failed: ${errMsg}`);
  }

  // Method 2: Bot API caption only (fallback)
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`,
      {
        chat_id: channelId,
        message_id: msgId,
        caption: newCaption,
      },
    );

    if (res.data?.ok) {
      console.log(`✅ Caption updated (no button): ${msgId}`);
      return true;
    }
  } catch (e) {
    const errMsg = e.response?.data?.description || e.message;
    console.log(`⚠️ Bot API caption only failed: ${errMsg}`);
  }

  // Method 3: gramJS editMessage
  try {
    await client.editMessage(channelId, {
      message: msgId,
      text: newCaption,
    });
    console.log(`✅ Caption updated (gramJS): ${msgId}`);
    return true;
  } catch (e) {
    console.log(`⚠️ gramJS editMessage failed: ${e.message}`);
  }

  console.log(`❌ All caption update methods failed for ${msgId}`);
  return false;
}

// Queue Management
// Replace addToQueue function
async function addToQueue(msgId, channelId, fileName, fileSize) {
  const uniqueKey = `${channelId}_${msgId}`;

  if (processedIds.has(uniqueKey)) {
    return false;
  }

  try {
    await UploadQueue.create({
      messageId: msgId,
      channelId,
      fileName,
      fileSize,
      addedAt: new Date(),
      retryCount: 0,
    });

    processedIds.add(uniqueKey);
    console.log(`➕ Queued: ${fileName} (ID: ${msgId})`);
    return true;
  } catch (e) {
    if (e.code === 11000) {
      // Already exists, skip
      processedIds.add(uniqueKey);
      return false;
    }
    console.error(`Queue error:`, e.message);
    return false;
  }
}

// Add to failed queue
async function addToFailed(msgId, channelId, fileName, fileSize, error) {
  try {
    await FailedQueue.findOneAndUpdate(
      { messageId: msgId, channelId },
      {
        messageId: msgId,
        channelId,
        fileName,
        fileSize,
        error,
        failedAt: new Date(),
      },
      { upsert: true },
    );
    console.log(`❌ Added to failed: ${fileName}`);
  } catch (e) {
    console.error(`Failed queue error:`, e.message);
  }
}

// Remove from queue (on complete, duplicate, or fail)
async function removeFromQueue(msgId, channelId) {
  try {
    await UploadQueue.deleteOne({ messageId: msgId, channelId });
  } catch (e) {
    console.error(`Remove queue error:`, e.message);
  }
}

// Replace processQueue function
async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    while (true) {
      // Get oldest queued item
      const next = await UploadQueue.findOne().sort({
        addedAt: 1,
        messageId: 1,
      });

      if (!next) {
        console.log("📭 Queue empty");
        break;
      }

      currentMsgId = next.messageId;
      const channelId = next.channelId;
      const retryInfo =
        next.retryCount > 0 ? ` (Retry ${next.retryCount}/${MAX_RETRIES})` : "";

      console.log(`\n${"═".repeat(50)}`);
      console.log(
        `🎬 ${next.fileName} (${formatBytes(next.fileSize)})${retryInfo}`,
      );
      console.log(`${"═".repeat(50)}`);

      try {
        const result = await uploadToRumble(
          next.messageId,
          channelId,
          next.fileName,
          next.fileSize,
          next.fileName.replace(/\.[^/.]+$/, ""),
        );

        if (result.success) {
          console.log(`\n✅ Complete! ID: ${result.videoId}`);
          console.log(`🔗 ${result.videoUrl}\n`);

          // Save to RumbleVideo
          try {
            await RumbleVideo.create({
              videoId: result.videoId,
              title: next.fileName.replace(/\.[^/.]+$/, ""),
              rumbleUrl: result.videoUrl,
              embedCode: result.embedCode,
              hlsUrl: "",
              fileSize: next.fileSize,
            });
            console.log("📝 Saved to DB:", result.videoId);
          } catch (e) {
            console.error("❌ DB Save Error:", e.message);
          }

          // Remove from queue
          await removeFromQueue(next.messageId, channelId);
          await updateProgress(
            next.fileName,
            next.fileSize,
            100,
            100,
            "success",
          );

          // Edit caption
          if (result.videoId) {
            await sleep(500);
            await editCaption(next.messageId, channelId, result.videoId);
          }
        }
      } catch (e) {
        console.error(`❌ Error: ${e.message}`);

        if (e.message === "DUPLICATE" || e.message?.includes("Duplicate")) {
          // Duplicate - just remove from queue
          console.log(`⏭️ Skipping duplicate`);
          await removeFromQueue(next.messageId, channelId);
          await updateProgress(next.fileName, next.fileSize, 0, 0, "skipped");
        } else if (
          isRetryableError(e) &&
          (next.retryCount || 0) < MAX_RETRIES
        ) {
          // Retryable error - increment retry count and keep in queue
          const newRetryCount = (next.retryCount || 0) + 1;
          console.log(`🔄 Retry ${newRetryCount}/${MAX_RETRIES} scheduled...`);

          await UploadQueue.updateOne(
            { messageId: next.messageId, channelId },
            { $set: { retryCount: newRetryCount } },
          );

          await updateProgress(
            next.fileName,
            next.fileSize,
            0,
            0,
            "retrying",
            `Attempt ${newRetryCount}/${MAX_RETRIES} - ${e.message}`,
          );

          // Wait before retry (increasing delay)
          await sleep(5000 * newRetryCount);
        } else {
          // Non-retryable error or max retries reached - move to failed
          const errorMsg =
            (next.retryCount || 0) >= MAX_RETRIES
              ? `Failed after ${MAX_RETRIES} retries: ${e.message}`
              : e.message;

          await addToFailed(
            next.messageId,
            channelId,
            next.fileName,
            next.fileSize,
            errorMsg,
          );
          await removeFromQueue(next.messageId, channelId);
          await updateProgress(next.fileName, next.fileSize, 0, 0, errorMsg);
        }
      }

      currentMsgId = null;
      resetProgressState();
      await sleep(2000);
    }
  } finally {
    isProcessing = false;
  }
}

// Replace handleChannelMessage function
async function handleChannelMessage(event) {
  const msg = event.message;
  if (!msg.peerId?.channelId) return;

  const channelId = -Number(`100${msg.peerId.channelId}`);
  if (!watchChannelIds.has(channelId)) return;
  if (!msg.media || !isVideoFile(msg)) return;

  const uniqueKey = `${channelId}_${msg.id}`;
  if (processedIds.has(uniqueKey)) return;

  const groupedId = msg.groupedId?.toString();

  // Handle media groups
  if (groupedId) {
    const groupKey = `${channelId}_${groupedId}`;
    if (!pendingMediaGroups.has(groupKey)) {
      pendingMediaGroups.set(groupKey, {
        messages: [],
        channelId,
        timeout: null,
      });
    }
    const group = pendingMediaGroups.get(groupKey);
    if (!group.messages.find((m) => m.id === msg.id)) {
      group.messages.push(msg);
    }
    clearTimeout(group.timeout);
    group.timeout = setTimeout(async () => {
      pendingMediaGroups.delete(groupKey);
      await processMediaGroup(groupedId, channelId, group.messages);
    }, 2000);
    return;
  }

  // Single file - add directly
  const { fileName, fileSize } = getFileInfo(msg);
  console.log(`📥 New: ${fileName} (${formatBytes(fileSize)})`);

  const added = await addToQueue(msg.id, channelId, fileName, fileSize);

  if (added && !isProcessing) {
    processQueue();
  }
}

// Simplified processMediaGroup
async function processMediaGroup(groupId, channelId, messages) {
  const sortedMessages = [...messages].sort((a, b) => a.id - b.id);
  console.log(`📦 Media group: ${sortedMessages.length} files`);

  let added = 0;
  for (const msg of sortedMessages) {
    if (!isVideoFile(msg)) continue;
    const { fileName, fileSize } = getFileInfo(msg);
    const wasAdded = await addToQueue(msg.id, channelId, fileName, fileSize);
    if (wasAdded) added++;
  }

  console.log(`✅ Added ${added}/${sortedMessages.length} from group`);

  if (added > 0 && !isProcessing) {
    processQueue();
  }
}

// Owner Commands
// Owner Commands - Fixed to not interfere with progress
// Replace handleOwnerMessage function
async function handleOwnerMessage(event) {
  const msg = event.message;
  if (!msg.isPrivate || Number(msg.chatId) !== OWNER_ID) return;

  const text = msg.text?.trim() || "";
  if (!text.startsWith("/")) return;

  const [cmd, ...args] = text.split(/\s+/);

  if (cmd === "/start") {
    await client.sendMessage(msg.chatId, {
      message:
        `👋 **Rumble Upload Bot**\n\n` +
        `📺 /channels - List channels\n` +
        `/addchannel <id/@user>\n` +
        `/removechannel <id/@user>\n\n` +
        `📊 /status - Stats\n` +
        `/queue - View queue\n` +
        `/failed - View failed\n` +
        `/retry <msgId> - Retry one\n` +
        `/retryall - Retry all failed\n` +
        `/clearfailed - Clear failed\n` +
        `/process - Force start`,
      parseMode: "markdown",
    });
  } else if (cmd === "/channels") {
    await client.sendMessage(msg.chatId, {
      message: await listWatchChannels(),
      parseMode: "markdown",
    });
  } else if (cmd === "/addchannel" && args[0]) {
    const result = await addWatchChannel(args[0], OWNER_ID);
    await client.sendMessage(msg.chatId, {
      message: result.message,
      parseMode: "markdown",
    });
  } else if ((cmd === "/removechannel" || cmd === "/delchannel") && args[0]) {
    const result = await removeWatchChannel(args[0]);
    await client.sendMessage(msg.chatId, {
      message: result.message,
      parseMode: "markdown",
    });
  } else if (cmd === "/status") {
    const queueCount = await UploadQueue.countDocuments();
    const failedCount = await FailedQueue.countDocuments();
    const totalUploaded = await RumbleVideo.countDocuments();

    // Calculate total queue size
    const queueAgg = await UploadQueue.aggregate([
      { $group: { _id: null, total: { $sum: "$fileSize" } } },
    ]);
    const totalQueueSize = queueAgg[0]?.total || 0;

    // Calculate total uploaded videos size
    const uploadedAgg = await RumbleVideo.aggregate([
      { $group: { _id: null, total: { $sum: "$fileSize" } } },
    ]);
    const totalUploadedSize = uploadedAgg[0]?.total || 0;

    const currentFile = currentMsgId
      ? (await UploadQueue.findOne({ messageId: currentMsgId }))?.fileName
      : null;

    await client.sendMessage(msg.chatId, {
      message:
        `📊 **Status**\n\n` +
        `📺 Channels: ${watchChannelIds.size}\n\n` +
        `📥 Queue: ${queueCount} (${formatBytes(totalQueueSize)})\n` +
        `❌ Failed: ${failedCount}\n` +
        `✅ Uploaded: ${totalUploaded} (${formatBytes(totalUploadedSize)})\n\n` +
        `⚙️ Processing: ${isProcessing ? "Yes" : "No"}\n` +
        `🔄 Current: ${currentFile || "None"}`,
      parseMode: "markdown",
    });
  } else if (cmd === "/queue") {
    const q = await UploadQueue.find().sort({ addedAt: 1 }).limit(15);
    const total = await UploadQueue.countDocuments();

    if (q.length === 0) {
      await client.sendMessage(msg.chatId, { message: "📭 Queue is empty" });
      return;
    }

    let text = `📋 **Queue (${total} total)**\n\n`;
    q.forEach((item, i) => {
      const name =
        item.fileName?.length > 30
          ? item.fileName.slice(0, 27) + "..."
          : item.fileName;
      const retryInfo = item.retryCount > 0 ? ` 🔄${item.retryCount}` : "";
      text += `${i + 1}. \`${item.messageId}\` ${name}${retryInfo}\n`;
    });

    if (total > 15) text += `\n... and ${total - 15} more`;

    await client.sendMessage(msg.chatId, {
      message: text,
      parseMode: "markdown",
    });
  } else if (cmd === "/failed") {
    const f = await FailedQueue.find().sort({ failedAt: -1 }).limit(15);
    const total = await FailedQueue.countDocuments();

    if (f.length === 0) {
      await client.sendMessage(msg.chatId, { message: "✅ No failed uploads" });
      return;
    }

    let text = `❌ **Failed (${total} total)**\n\n`;
    f.forEach((item, i) => {
      const name =
        item.fileName?.length > 25
          ? item.fileName.slice(0, 22) + "..."
          : item.fileName;
      const err = item.error?.slice(0, 30) || "Unknown";
      text += `${i + 1}. \`${item.messageId}\` ${name}\n   ↳ ${err}\n`;
    });

    if (total > 15) text += `\n... and ${total - 15} more`;

    await client.sendMessage(msg.chatId, {
      message: text,
      parseMode: "markdown",
    });
  } else if (cmd === "/retry" && args[0]) {
    const msgIdToRetry = parseInt(args[0]);
    const failed = await FailedQueue.findOne({ messageId: msgIdToRetry });

    if (!failed) {
      await client.sendMessage(msg.chatId, {
        message: "❌ Not found in failed queue",
      });
      return;
    }

    // Move back to queue
    await addToQueue(
      failed.messageId,
      failed.channelId,
      failed.fileName,
      failed.fileSize,
    );
    await FailedQueue.deleteOne({
      messageId: msgIdToRetry,
      channelId: failed.channelId,
    });

    await client.sendMessage(msg.chatId, {
      message: `✅ Re-queued: ${failed.fileName}`,
    });

    if (!isProcessing) processQueue();
  } else if (cmd === "/retryall") {
    const allFailed = await FailedQueue.find();

    if (allFailed.length === 0) {
      await client.sendMessage(msg.chatId, {
        message: "✅ No failed uploads to retry",
      });
      return;
    }

    let count = 0;
    for (const item of allFailed) {
      const added = await addToQueue(
        item.messageId,
        item.channelId,
        item.fileName,
        item.fileSize,
      );
      if (added) {
        await FailedQueue.deleteOne({
          messageId: item.messageId,
          channelId: item.channelId,
        });
        count++;
      }
    }

    await client.sendMessage(msg.chatId, {
      message: `✅ Re-queued ${count} failed uploads`,
    });

    if (count > 0 && !isProcessing) processQueue();
  } else if (cmd === "/clearfailed") {
    const result = await FailedQueue.deleteMany({});
    await client.sendMessage(msg.chatId, {
      message: `🗑️ Cleared ${result.deletedCount} failed items`,
    });
  } else if (cmd === "/process") {
    if (isProcessing) {
      await client.sendMessage(msg.chatId, {
        message: "⚙️ Already processing...",
      });
    } else {
      const count = await UploadQueue.countDocuments();
      if (count === 0) {
        await client.sendMessage(msg.chatId, { message: "📭 Queue is empty" });
      } else {
        await client.sendMessage(msg.chatId, {
          message: `🚀 Starting... (${count} in queue)`,
        });
        processQueue();
      }
    }
  }
}

// app.get("/health", (_, res) => res.send("OK"));

// Shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await clearSenderCache();
  process.exit(0);
});

// Start
// Replace main function
async function main() {
  console.log("🚀 Starting Rumble Auto Upload Bot...");

  await client.start({ botAuthToken: BOT_TOKEN });
  fs.writeFileSync("session.txt", client.session.save());

  const me = await client.getMe();
  console.log(`✅ Bot: @${me.username}`);

  const cookies = getRumbleCookies();
  console.log(
    cookies.u_s && cookies.a_s ? "✅ Rumble ready" : "⚠️ Rumble not configured",
  );

  // Setup indexes
  try {
    await UploadQueue.collection.createIndex(
      { messageId: 1, channelId: 1 },
      { unique: true },
    );
    await FailedQueue.collection.createIndex(
      { messageId: 1, channelId: 1 },
      { unique: true },
    );
  } catch (e) {}

  await loadWatchChannels();
  console.log(
    watchChannelIds.size > 0
      ? `📺 Watching ${watchChannelIds.size} channel(s)`
      : "⚠️ No channels",
  );

  client.addEventHandler(handleChannelMessage, new NewMessage({}));
  client.addEventHandler(handleOwnerMessage, new NewMessage({}));

  // Check pending queue
  const pending = await UploadQueue.countDocuments();
  console.log(`📊 Pending: ${pending}`);

  if (pending > 0) {
    processQueue();
  }

}

module.exports = { main };