const { Telegraf } = require("telegraf");

// Initialize the bot with the token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Define the URL for the Telegram Mini App (from environment variables)
const webAppUrl =
  process.env.TELEGRAM_WEBAPP_URL || "https://your-domain.com/tg";

// Handle the /start command
bot.start((ctx) => {
  ctx.reply("Welcome to our app!", {
    reply_markup: {
      inline_keyboard: [[{ text: "Open App", web_app: { url: webAppUrl } }]],
    },
  });
});

// Handle regular messages
bot.on("message", (ctx) => {
  ctx.reply("Try opening our app!", {
    reply_markup: {
      keyboard: [[{ text: "Open App", web_app: { url: webAppUrl } }]],
      resize_keyboard: true,
    },
  });
});

// Start the bot
bot
  .launch()
  .then(() => {
    console.log("Bot started successfully!");
  })
  .catch((err) => {
    console.error("Error starting bot:", err);
  });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
