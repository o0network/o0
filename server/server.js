import Fastify from "fastify";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { execFile } from "child_process";
import fetch from "node-fetch";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const videosDir = path.join(__dirname, "videos");
const thumbnailsDir = path.join(__dirname, "thumbnails");
const pendingDir = path.join(__dirname, "pending");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || "";

await fs.mkdir(videosDir, { recursive: true });
await fs.mkdir(thumbnailsDir, { recursive: true });
await fs.mkdir(pendingDir, { recursive: true });

const fastify = Fastify({
  logger: true,
});

if (process.env.NODE_ENV === "development") {
  try {
    const { default: mcpPlugin } = await import("@mcp-it/fastify");
    await fastify.register(mcpPlugin, {
      name: "O0 Video API",
      description: "API for exploring and accessing videos",
    });
    fastify.log.info("MCP plugin registered for development");
  } catch (err) {
    fastify.log.warn("Failed to register MCP plugin:", err.message);
  }
}

await fastify.register(import("@fastify/cors"), {
  origin: "*",
});

await fastify.register(import("@fastify/static"), {
  root: videosDir,
  prefix: "/api/video/",
  decorateReply: false,
});

function createVideoNoteFromFile(filename) {
  const address = path.basename(filename, ".mp4");
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    address,
    timestamp,
    discussion: `https://example.com/discuss/${address}`,
    stats: {
      price: (Math.random() * 0.01).toFixed(4),
      minted: Math.floor(Math.random() * 30),
      value: (Math.random() * 0.5).toFixed(2),
    },
  };
}

async function generateThumbnail(videoPath, outputDir, thumbnailName) {
  const thumbnailFile = `${thumbnailName}.jpg`;
  const thumbnailFullPath = path.join(outputDir, thumbnailFile);

  const args = [
    "-y",
    "-ss",
    "00:00:00",
    "-i",
    videoPath,
    "-vframes",
    "1",
    "-q:v",
    "2",
    thumbnailFullPath,
  ];

  return new Promise((resolve, reject) => {
    execFile(ffmpegPath, args, (error, stdout, stderr) => {
      if (error) {
        fastify.log.error(`FFmpeg error: ${error.message}`);
        reject(error);
        return;
      }
      resolve(thumbnailFullPath);
    });
  });
}

fastify.get(
  "/api/explore",
  {
    schema: {
      operationId: "get_all_videos",
      summary: "Get all videos",
      description: "Returns all available videos",
      querystring: {
        type: "object",
        properties: {
          amount: {
            type: "integer",
            default: 10,
            description: "Number of videos to return",
          },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "array",
          items: {
            type: "object",
            properties: {
              address: { type: "string" },
              thumbnailUrl: { type: "string" },
              source: { type: "string" },
              timestamp: { type: "integer" },
              stats: {
                type: "object",
                properties: {
                  price: { type: "string" },
                  minted: { type: "string" },
                  value: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const amount = request.query.amount || 10;
      const files = (await fs.readdir(videosDir))
        .filter((file) => file.endsWith(".mp4"))
        .slice(0, amount);

      if (!files.length) {
        return [];
      }

      const videoNotes = files.map(createVideoNoteFromFile);
      return videoNotes;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: "Failed to fetch videos" });
    }
  }
);

fastify.get(
  "/api/videos/next",
  {
    schema: {
      operationId: "get_next_videos",
      summary: "Get next batch of videos",
      description: "Returns next batch of videos based on threshold and limit",
      querystring: {
        type: "object",
        properties: {
          threshold: {
            type: "integer",
            default: 0,
            description: "Pagination threshold",
          },
          limit: {
            type: "integer",
            default: 9,
            description: "Number of videos to return",
          },
          screenRatio: {
            type: "number",
            default: 1,
            description: "Client screen ratio for layout optimization",
          },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "array",
          items: {
            type: "object",
            properties: {
              address: { type: "string" },
              timestamp: { type: "integer" },
              stats: {
                type: "object",
                properties: {
                  price: { type: "string" },
                  minted: { type: "string" },
                  value: { type: "string" },
                },
              },
              discussion: { type: "string" },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const threshold = parseInt(request.query.threshold) || 0;
      const limit = parseInt(request.query.limit) || 9;
      const screenRatio = parseFloat(request.query.screenRatio) || 1;

      const adjustedLimit = screenRatio > 1 ? Math.ceil(limit * 1.5) : limit;

      // Read all available video files
      const allFiles = (await fs.readdir(videosDir))
        .filter((file) => file.endsWith(".mp4"));

      // Apply pagination
      if (threshold >= allFiles.length) {
        fastify.log.warn(`Threshold ${threshold} exceeds available videos (${allFiles.length})`);
        return reply.code(404).send({ error: "No more videos available" });
      }

      // Get the paginated subset
      const files = allFiles.slice(threshold, threshold + adjustedLimit);

      if (!files.length) {
        fastify.log.warn("No videos available in requested range");
        return reply.code(404).send({ error: "No more videos available" });
      }

      fastify.log.info(`Returning ${files.length} videos from threshold ${threshold}`);

      // Generate thumbnails in advance
      for (const file of files) {
        const fileBase = path.basename(file, ".mp4");
        const videoPath = path.join(videosDir, file);
        const thumbnailPath = path.join(thumbnailsDir, `${fileBase}.jpg`);

        try {
          await fs.access(thumbnailPath);
        } catch (err) {
          try {
            await generateThumbnail(videoPath, thumbnailsDir, fileBase);
          } catch (thumbError) {
            fastify.log.error(`Failed to generate thumbnail for ${fileBase}`);
          }
        }
      }

      const videoNotes = files.map(createVideoNoteFromFile);
      return videoNotes;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: "Failed to fetch videos" });
    }
  }
);

fastify.get(
  "/api/thumbnail/:addr",
  {
    schema: {
      operationId: "get_thumbnail",
      summary: "Get thumbnail by address",
      description: "Returns a thumbnail image for a video",
      params: {
        type: "object",
        required: ["addr"],
        properties: {
          addr: { type: "string", description: "Video address" },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      let { addr } = request.params;
      if (addr.endsWith(".jpg")) addr = addr.slice(0, -4);
      const videoPath = path.join(videosDir, `${addr}.mp4`);
      const thumbnailPath = path.join(thumbnailsDir, `${addr}.jpg`);
      try {
        await fs.access(videoPath);
      } catch (err) {
        fastify.log.error(`Video not found for thumbnail: ${videoPath}`);
        return reply.code(404).send({ error: "Video not found" });
      }
      try {
        await fs.access(thumbnailPath);
      } catch (err) {
        try {
          await generateThumbnail(videoPath, thumbnailsDir, addr);
        } catch (genErr) {
          fastify.log.error(`Failed to generate thumbnail: ${genErr.message}`);
          return reply
            .code(500)
            .send({ error: "Failed to generate thumbnail" });
        }
      }
      reply.header("Content-Type", "image/jpeg");
      try {
        return reply.sendFile(`${addr}.jpg`, thumbnailsDir);
      } catch (sendFileErr) {
        try {
          const data = await fs.readFile(thumbnailPath);
          return reply.send(data);
        } catch (readErr) {
          fastify.log.error(`Failed to read thumbnail: ${readErr.message}`);
          return reply.code(500).send({ error: "Failed to read thumbnail" });
        }
      }
    } catch (err) {
      fastify.log.error(`Failed to retrieve thumbnail: ${err.message}`);
      return reply.code(500).send({ error: "Failed to retrieve thumbnail" });
    }
  }
);

fastify.get(
  "/api/video/:addr",
  {
    schema: {
      operationId: "get_video",
      summary: "Get video by address",
      description: "Returns a video file",
      params: {
        type: "object",
        required: ["addr"],
        properties: {
          addr: { type: "string", description: "Video address" },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      let { addr } = request.params;
      if (addr.endsWith(".mp4")) addr = addr.slice(0, -4);
      const videoPath = path.join(videosDir, `${addr}.mp4`);
      try {
        await fs.access(videoPath);
      } catch (err) {
        fastify.log.error(`Video not found: ${videoPath}`);
        return reply.code(404).send({ error: "Video not found" });
      }
      reply.header("Content-Type", "video/mp4");
      try {
        return reply.sendFile(`${addr}.mp4`, videosDir);
      } catch (sendFileErr) {
        try {
          const data = await fs.readFile(videoPath);
          return reply.send(data);
        } catch (readErr) {
          fastify.log.error(`Failed to read video: ${readErr.message}`);
          return reply.code(500).send({ error: "Failed to read video" });
        }
      }
    } catch (err) {
      fastify.log.error(`Failed to retrieve video: ${err.message}`);
      return reply.code(500).send({ error: "Failed to retrieve video" });
    }
  }
);

// New endpoint for pitch-specific price data
fastify.get(
  "/api/pitch/:addr/price",
  {
    schema: {
      operationId: "get_pitch_price_data",
      summary: "Get price data for a specific pitch",
      description: "Returns mock price data for a given pitch address",
      params: {
        type: "object",
        required: ["addr"],
        properties: {
          addr: { type: "string", description: "Pitch address" },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "object",
          properties: {
            timeframe: { type: "string" },
            points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "integer" },
                  value: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const { addr } = request.params;
      // Check if the corresponding video/pitch exists (optional, but good practice)
      const videoPath = path.join(videosDir, `${addr}.mp4`);
      try {
        await fs.access(videoPath);
      } catch (err) {
        fastify.log.warn(`Video/Pitch not found for price data: ${addr}`);
        // We can still return mock data, or a 404
        // For now, let's return mock data even if the video doesn't exist
      }

      const points = [];
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      let currentValue = Math.random() * 100 + 50; // Start value between 50 and 150

      for (let i = 0; i < 30; i++) {
        // 30 data points for a month
        const timestamp = Math.floor((now - (30 - i) * oneDay) / 1000);
        currentValue += (Math.random() - 0.5) * 10; // Fluctuate value
        if (currentValue < 10) currentValue = 10; // Ensure minimum value
        points.push({ timestamp, value: parseFloat(currentValue.toFixed(2)) });
      }

      return { timeframe: "1M", points };
    } catch (err) {
      fastify.log.error(err);
      return reply
        .code(500)
        .send({ error: "Failed to fetch pitch price data" });
    }
  }
);

// New endpoint for /api/explore/:ipfsHash
fastify.get(
  "/api/explore/:ipfsHash",
  {
    schema: {
      operationId: "get_explore_data_by_ipfs",
      summary: "Get exploration data for a specific IPFS hash",
      description: "Returns data for an IPFS item, including specific graph data.",
      params: {
        type: "object",
        required: ["ipfsHash"],
        properties: {
          ipfsHash: { type: "string", description: "IPFS hash of the item" },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "object",
          properties: {
            ipfsHash: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            discussionUrl: { type: "string" },
            mintsVsPriceData: {
              type: "object",
              properties: {
                xAxisLabel: { type: "string" },
                yAxisLabel: { type: "string" },
                points: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      price: { type: "number" }, // Price (ETH) for x-axis
                      mints: { type: "number" }, // Number of Mints for y-axis
                    },
                  },
                },
              },
            },
            // You can also include standard time-series price data if needed
            // priceData: { ... existing PriceData schema ... }
          },
        },
        404: {
          description: "Item not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { ipfsHash } = request.params;
    // In a real scenario, you'd fetch data based on ipfsHash from a DB or another service
    // For now, mock data:
    if (ipfsHash === " QmExampleHash123" || ipfsHash.startsWith("Qm")) { // Simple check for a mock hash
      // Mock data for the "Mints vs. Price" graph from the image
      const mockMintsVsPricePoints = [
        { price: 0.1, mints: 10 }, { price: 0.12, mints: 15 }, { price: 0.15, mints: 8 },
        { price: 0.2, mints: 25 }, { price: 0.22, mints: 30 }, { price: 0.25, mints: 20 },
        { price: 0.3, mints: 40 }, { price: 0.33, mints: 35 }, { price: 0.37, mints: 50 },
        { price: 0.4, mints: 60 }, { price: 0.42, mints: 45 }, { price: 0.45, mints: 55 },
        { price: 0.5, mints: 70 }, { price: 0.53, mints: 65 }, { price: 0.58, mints: 80 },
      ].sort((a,b) => a.price - b.price); // Ensure price is sorted for bar chart

      return {
        ipfsHash,
        name: `Exploration Item ${ipfsHash.substring(0, 10)}`,
        description: "This is a mock description for an item explored via its IPFS hash.",
        discussionUrl: `https://example.com/discuss/ipfs/${ipfsHash}`,
        mintsVsPriceData: {
          xAxisLabel: "Price (ETH)",
          yAxisLabel: "Number of Mints",
          points: mockMintsVsPricePoints,
        },
      };
    } else {
      return reply.code(404).send({ error: "Item not found for this IPFS hash" });
    }
  }
);

// Function to notify admin about a pending video validation
async function notifyAdminAboutValidation(videoData) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    fastify.log.warn(
      "Telegram bot token or admin chat ID not configured for validation notifications"
    );
    return false;
  }

  try {
    const message = `🔍 New video note pending validation:\n\nUser: ${
      videoData.userId
    }\nTitle: ${videoData.title || "Untitled"}\nAddress: ${videoData.address}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              {
                text: "✅ Approve",
                callback_data: `approve_${videoData.address}`,
              },
              {
                text: "❌ Reject",
                callback_data: `reject_${videoData.address}`,
              },
            ],
          ],
        }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      fastify.log.error(`Telegram API error: ${JSON.stringify(error)}`);
      return false;
    }

    return true;
  } catch (error) {
    fastify.log.error(`Error notifying admin: ${error.message}`);
    return false;
  }
}

// Function to notify user about validation status
async function notifyUserAboutValidation(userId, status, videoAddress) {
  if (!TELEGRAM_BOT_TOKEN) {
    fastify.log.warn(
      "Telegram bot token not configured for user notifications"
    );
    return false;
  }

  try {
    const message =
      status === "approved"
        ? `✅ Your video note (${videoAddress}) has been approved and is now live!`
        : `❌ Your video note (${videoAddress}) was not approved. Please try again with a different video.`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: userId,
        text: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      fastify.log.error(`Telegram API error: ${JSON.stringify(error)}`);
      return false;
    }

    return true;
  } catch (error) {
    fastify.log.error(`Error notifying user: ${error.message}`);
    return false;
  }
}

// Add a new endpoint for video submission
fastify.post(
  "/api/videos/submit",
  {
    schema: {
      operationId: "submit_video",
      summary: "Submit a video for validation",
      description:
        "Submits a video note for admin validation before publishing",
      body: {
        type: "object",
        required: ["video", "userId"],
        properties: {
          video: {
            type: "string",
            format: "binary",
            description: "Video file",
          },
          title: { type: "string", description: "Video title" },
          userId: { type: "string", description: "User ID for notification" },
        },
      },
      response: {
        200: {
          description: "Successful submission",
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            address: { type: "string" },
          },
        },
        400: {
          description: "Bad request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const data = await request.file();

      if (!data || !data.file) {
        return reply.code(400).send({ error: "No video file provided" });
      }

      // Generate a unique address for the video
      const address = crypto.randomBytes(16).toString("hex");
      const pendingVideoPath = path.join(pendingDir, `${address}.mp4`);

      // Create a JSON metadata file with submission details
      const metadata = {
        userId: request.body.userId,
        title: request.body.title || "Untitled",
        address: address,
        timestamp: Date.now(),
        status: "pending",
      };
      const metadataPath = path.join(pendingDir, `${address}.json`);

      // Save the video file
      const writeStream = fs.createWriteStream(pendingVideoPath);
      await data.file.pipe(writeStream);

      // Save the metadata
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      // Notify admin about pending validation
      const notified = await notifyAdminAboutValidation(metadata);

      if (!notified) {
        fastify.log.warn(`Couldn't notify admin about video ${address}`);
      }

      return {
        success: true,
        message: "Video submitted for validation",
        address: address,
      };
    } catch (err) {
      fastify.log.error(`Error submitting video: ${err.message}`);
      return reply.code(500).send({ error: "Failed to submit video" });
    }
  }
);

// Endpoint to check video validation status
fastify.get(
  "/api/videos/status/:address",
  {
    schema: {
      operationId: "check_video_status",
      summary: "Check video validation status",
      description: "Returns the validation status of a submitted video",
      params: {
        type: "object",
        required: ["address"],
        properties: {
          address: { type: "string", description: "Video address" },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
            },
            message: { type: "string" },
          },
        },
        404: {
          description: "Video not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const { address } = request.params;
      const metadataPath = path.join(pendingDir, `${address}.json`);

      try {
        await fs.access(metadataPath);
      } catch (err) {
        // Check if it's in the published videos
        const videoPath = path.join(videosDir, `${address}.mp4`);
        try {
          await fs.access(videoPath);
          return {
            status: "approved",
            message: "Video has been approved and published",
          };
        } catch (videoErr) {
          return reply.code(404).send({ error: "Video not found" });
        }
      }

      const metadataStr = await fs.readFile(metadataPath, "utf8");
      const metadata = JSON.parse(metadataStr);

      return {
        status: metadata.status,
        message:
          metadata.status === "pending"
            ? "Video is pending approval"
            : metadata.status === "approved"
            ? "Video has been approved"
            : "Video was rejected",
      };
    } catch (err) {
      fastify.log.error(`Error checking video status: ${err.message}`);
      return reply.code(500).send({ error: "Failed to check video status" });
    }
  }
);

// Endpoint for admin to validate videos
fastify.post(
  "/api/videos/validate/:address",
  {
    schema: {
      operationId: "validate_video",
      summary: "Validate a pending video",
      description: "Admin endpoint to approve or reject a pending video",
      params: {
        type: "object",
        required: ["address"],
        properties: {
          address: { type: "string", description: "Video address" },
        },
      },
      body: {
        type: "object",
        required: ["status", "adminKey"],
        properties: {
          status: { type: "string", enum: ["approved", "rejected"] },
          adminKey: { type: "string", description: "Admin authentication key" },
        },
      },
      response: {
        200: {
          description: "Successful validation",
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
        401: {
          description: "Unauthorized",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        404: {
          description: "Video not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const { address } = request.params;
      const { status, adminKey } = request.body;

      // Simple admin key validation - in production, use a more secure approach
      if (adminKey !== process.env.ADMIN_KEY) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const metadataPath = path.join(pendingDir, `${address}.json`);
      const pendingVideoPath = path.join(pendingDir, `${address}.mp4`);

      try {
        await fs.access(metadataPath);
        await fs.access(pendingVideoPath);
      } catch (err) {
        return reply.code(404).send({ error: "Pending video not found" });
      }

      // Read metadata
      const metadataStr = await fs.readFile(metadataPath, "utf8");
      const metadata = JSON.parse(metadataStr);

      // Update metadata status
      metadata.status = status;
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      if (status === "approved") {
        // Move video to videos directory
        const publishPath = path.join(videosDir, `${address}.mp4`);
        await fs.copyFile(pendingVideoPath, publishPath);

        // Generate thumbnail
        try {
          await generateThumbnail(publishPath, thumbnailsDir, address);
        } catch (thumbError) {
          fastify.log.error(
            `Failed to generate thumbnail for ${address}: ${thumbError.message}`
          );
        }
      }

      // Notify user about the validation result
      await notifyUserAboutValidation(metadata.userId, status, address);

      return {
        success: true,
        message: `Video ${
          status === "approved" ? "approved and published" : "rejected"
        }`,
      };
    } catch (err) {
      fastify.log.error(`Error validating video: ${err.message}`);
      return reply.code(500).send({ error: "Failed to validate video" });
    }
  }
);

// Add a new endpoint for assets by address
fastify.get(
  "/api/assets/:address",
  {
    schema: {
      operationId: "get_assets_by_address",
      summary: "Get assets for an address",
      description: "Returns assets for a given address",
      params: {
        type: "object",
        required: ["address"],
        properties: {
          address: { type: "string", description: "Wallet address" },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: { type: "string" },
              name: { type: "string" },
              symbol: { type: "string" },
              address: { type: "string" },
              value: { type: "string" },
              priceChange: { type: "number" },
              lastUpdated: { type: "string" },
              discussion: { type: "string" },
            },
          },
        },
        400: {
          description: "Invalid address format",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const { address } = request.params;

      // Validate address - reject placeholder text or clearly invalid addresses
      if (address.includes("select an item first") || address.includes("%20")) {
        return reply.code(400).send({
          error: "Invalid address format",
          message: "Please provide a valid address",
        });
      }

      // For demo purposes, generate mock assets for any valid-looking address
      // In a real app, you'd query a database or blockchain API
      const assetTypes = ["token", "nft", "pitch", "other"];
      const assetNames = ["Bitcoin", "Ethereum", "Solana", "Uniswap", "Aave", "Chainlink"];
      const assetSymbols = ["BTC", "ETH", "SOL", "UNI", "AAVE", "LINK"];

      const assets = Array.from({ length: 5 }, (_, i) => {
        const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
        const nameIndex = Math.floor(Math.random() * assetNames.length);
        return {
          id: `asset-${address.substring(0, 8)}-${i}`,
          type,
          name: assetNames[nameIndex],
          symbol: assetSymbols[nameIndex],
          address: `0x${crypto.randomBytes(20).toString("hex")}`,
          value: (Math.random() * 1000).toFixed(2), // String value, not "X minted" format
          priceChange: (Math.random() * 20) - 10, // Between -10 and +10
          lastUpdated: new Date().toISOString().split("T")[0],
          discussion: `https://example.com/discuss/${type}/${i}`,
          price: (Math.random() * 10).toFixed(2), // Clean number as string
          minted: Math.floor(Math.random() * 100).toString(), // Clean number as string
        };
      });

      return assets;
    } catch (err) {
      fastify.log.error(`Error fetching assets: ${err.message}`);
      return reply.code(500).send({ error: "Failed to fetch assets" });
    }
  }
);

// Add a price data endpoint
fastify.get(
  "/api/price/:address",
  {
    schema: {
      operationId: "get_price_data",
      summary: "Get price data for an address",
      description: "Returns price data points for a given address",
      params: {
        type: "object",
        required: ["address"],
        properties: {
          address: { type: "string", description: "Asset or wallet address" },
        },
      },
      response: {
        200: {
          description: "Successful response",
          type: "object",
          properties: {
            timeframe: { type: "string" },
            points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "number" },
                  value: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      const { address } = request.params;

      // For demo/placeholder text, return empty data
      if (address.includes("select an item first") || address.includes("%20")) {
        return { timeframe: "1M", points: [] };
      }

      // Generate mock price data
      const points = [];
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      let currentValue = Math.random() * 100 + 50; // Start between 50-150

      for (let i = 0; i < 30; i++) {
        const timestamp = Math.floor((now - (30 - i) * oneDay) / 1000);
        currentValue += (Math.random() - 0.5) * 10; // Random fluctuation
        if (currentValue < 10) currentValue = 10; // Minimum value
        points.push({ timestamp, value: parseFloat(currentValue.toFixed(2)) });
      }

      return { timeframe: "1M", points };
    } catch (err) {
      fastify.log.error(`Error fetching price data: ${err.message}`);
      return reply.code(500).send({ error: "Failed to fetch price data" });
    }
  }
);

// Start the server
try {
  await fastify.listen({ port: 5555, host: "0.0.0.0" });
  console.log(`Server is running at ${fastify.server.address().port}`);
  console.log(
    `MCP SSE server running at http://localhost:${
      fastify.server.address().port
    }/mcp/sse`
  );
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
