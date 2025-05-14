import Fastify from "fastify";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { execFile } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const videosDir = path.join(__dirname, "videos");
const thumbnailsDir = path.join(__dirname, "thumbnails");

await fs.mkdir(videosDir, { recursive: true });
await fs.mkdir(thumbnailsDir, { recursive: true });

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
    thumbnailUrl: `/api/thumbnail/${address}`,
    source: `/api/video/${address}`,
    timestamp,
    stats: {
      price: (Math.random() * 0.01).toFixed(4),
      minted: `${Math.floor(Math.random() * 30)} minted`,
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
              thumbnailUrl: { type: "string" },
              source: { type: "string" },
              timestamp: { type: "integer" },
              stats: {
                type: "object",
                properties: {
                  price: { type: "number" },
                  minted: { type: "integer" },
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
      const threshold = parseInt(request.query.threshold) || 0;
      const limit = parseInt(request.query.limit) || 9;
      const screenRatio = parseFloat(request.query.screenRatio) || 1;

      const adjustedLimit = screenRatio > 1 ? Math.ceil(limit * 1.5) : limit;

      const files = (await fs.readdir(videosDir))
        .filter((file) => file.endsWith(".mp4"))
        .slice(threshold, threshold + adjustedLimit);

      if (!files.length) {
        return reply.code(404).send({ error: "No more videos available" });
      }

      // generate thumbnails in advance
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
