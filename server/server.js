const fastify = require("fastify")({ logger: true });
const IPFS = require("ipfs-core");
const path = require("path");
const env = require("dotenv");
const fs = require("fs");
const { execFile } = require("child_process");

let ipfs;
(async () => {
  ipfs = await IPFS.create();
  fastify.log.info("IPFS node started");
})();

env.config();

const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";

fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "videos"),
  prefix: "/api/videos/",
  decorateReply: false,
});

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "thumbnails"),
  prefix: "/api/thumbnails/",
  decorateReply: false,
});

const createVideoObject = (file, videoDir) => {
  const id = path.basename(file, ".mp4");
  const stats = fs.statSync(path.join(videoDir, file));
  const address = `video-${id}`;

  return {
    id,
    address,
    filename: file,
    videoUrl: `/api/videos/${file}`,
    thumbnailUrl: `/api/thumbnails/${id}.jpg`,
    timestamp: Math.floor(stats.mtime.getTime() / 1000),
    size: stats.size,
    stats: [
      `${(Math.random() * 0.01).toFixed(4)} ETH`,
      `${Math.floor(Math.random() * 30)} minted`,
      `${(Math.random() * 0.5).toFixed(2)}$ value`,
    ],
    source: `/api/videos/${file}`,
  };
};

fastify.get("/api/videos", async (request, reply) => {
  try {
    const videoDir = path.join(__dirname, "videos");
    const files = fs
      .readdirSync(videoDir)
      .filter((file) => file.endsWith(".mp4"));

    const videos = files.map((file) => createVideoObject(file, videoDir));
    return videos;
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: "Failed to retrieve videos" });
  }
});

fastify.get("/api/videos/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const videoFilename = `${id}.mp4`;
    const videoPath = path.join(__dirname, "videos", videoFilename);

    if (!fs.existsSync(videoPath)) {
      return reply.code(404).send({ error: "Video not found" });
    }

    return createVideoObject(videoFilename, path.join(__dirname, "videos"));
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: "Failed to retrieve video" });
  }
});

fastify.get("/api/videos/next", async (request, reply) => {
  try {
    const threshold = parseInt(request.query.threshold) || 0;
    const limit = parseInt(request.query.limit) || 9;
    const screenRatio = parseFloat(request.query.screenRatio) || 1;

    const adjustedLimit = screenRatio > 1 ? Math.ceil(limit * 1.5) : limit;

    const videoDir = path.join(__dirname, "videos");
    const allFiles = fs
      .readdirSync(videoDir)
      .filter((file) => file.endsWith(".mp4"))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(videoDir, a));
        const statB = fs.statSync(path.join(videoDir, b));
        return statB.mtime.getTime() - statA.mtime.getTime();
      });

    const paginatedFiles = allFiles.slice(threshold, threshold + adjustedLimit);

    const thumbnailsDir = path.join(__dirname, "thumbnails");
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    for (const file of paginatedFiles) {
      const videoId = path.basename(file, ".mp4");
      const thumbnailPath = path.join(thumbnailsDir, `${videoId}.jpg`);
      const videoFilePath = path.join(videoDir, file);

      if (!fs.existsSync(thumbnailPath)) {
        try {
          request.log.info(`Generating thumbnail for ${videoId}`);
          await generateThumbnail(videoFilePath, thumbnailsDir, videoId);
          request.log.info(`Thumbnail generated for ${videoId}`);
        } catch (thumbError) {
          request.log.error(
            thumbError,
            `Failed to generate thumbnail for ${videoId}`
          );
        }
      }
    }

    const videoData = paginatedFiles.map((file) =>
      createVideoObject(file, videoDir)
    );

    return videoData;
  } catch (error) {
    request.log.error(error, "Error fetching videos");
    return reply.code(500).send({ error: "Failed to fetch videos" });
  }
});

fastify.post("/api/store", async (request, reply) => {
  const data = request.body;
  const result = await ipfs.add(JSON.stringify(data));
  return { cid: result.cid.toString() };
});

fastify.get("/api/retrieve/:cid", async (request, reply) => {
  const cid = request.params.cid;
  const stream = ipfs.cat(cid);
  let data = "";
  for await (const chunk of stream) {
    data += chunk.toString();
  }
  return JSON.parse(data);
});

async function generateThumbnail(videoFilePath, outputDir, thumbnailName) {
  const thumbnailFile = `${thumbnailName}.jpg`;
  const thumbnailFullPath = path.join(outputDir, thumbnailFile);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const args = [
    "-y",
    "-ss",
    "00:00:00",
    "-i",
    videoFilePath,
    "-vframes",
    "1",
    "-q:v",
    "2",
    thumbnailFullPath,
  ];

  return new Promise((resolve, reject) => {
    execFile(ffmpegPath, args, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ffmpeg: ${error.message}`);
        console.error(`ffmpeg stderr: ${stderr}`);
        if (error.code === "ENOENT") {
          console.error(
            `ffmpeg executable not found at ${ffmpegPath}. Make sure ffmpeg is installed and FFMPEG_PATH is correct if set.`
          );
        }
        reject(error);
        return;
      }
      console.log(`Thumbnail generated: ${thumbnailFullPath}`);
      resolve(thumbnailFullPath);
    });
  });
}

const start = async () => {
  try {
    await fastify.listen({ port: 5555, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
