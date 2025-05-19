import os
import logging
import asyncio
import json

from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, Router, F
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message,
    KeyboardButton,
    ReplyKeyboardMarkup,
    FSInputFile,
    WebAppInfo,
    CallbackQuery,
)

load_dotenv()
TOKEN = os.getenv("TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5555")
ADMIN_KEY = os.getenv("ADMIN_KEY", "admin_secret_key")

logging.basicConfig(level=logging.INFO)

router = Router()

main_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(
                text="🔥 Launch App 🔥",
                web_app=WebAppInfo(url="https://o0.network/explore"),
            ),
        ]
    ],
    resize_keyboard=True,
    is_persistent=True,
)


@router.message(CommandStart())
async def start(message: Message):
    try:
        video_note = FSInputFile("about.mp4")
        await message.answer_video_note(
            video_note,
            disable_notification=True,
            protect_content=True,
        )

        msg = "🌐 <b><a href='https://o0.network'>o0.network</a></b>"
        await message.answer(
            msg,
            reply_markup=main_keyboard,
            disable_notification=True,
            message_effect_id="5104841245755180586",
            parse_mode="HTML",
        )
    except Exception as e:
        logging.error(f"Error sending video note: {e}")
        await message.answer(
            f"Sorry, couldn't send the video. {msg}",
            reply_markup=main_keyboard,
            disable_notification=True,
            parse_mode="HTML",
        )


@router.callback_query(F.data.startswith(("approve_", "reject_")))
async def handle_validation_callback(callback_query: CallbackQuery):
    bot = callback_query.bot

    if not ADMIN_CHAT_ID or str(callback_query.from_user.id) != ADMIN_CHAT_ID:
        await callback_query.answer(
            "You are not authorized to perform this action.", show_alert=True
        )
        return

    action, video_address = callback_query.data.split("_", 1)
    status = "approved" if action == "approve" else "rejected"

    try:
        import aiohttp

        async with aiohttp.ClientSession() as session:
            api_url = f"{SERVER_URL}/api/videos/validate/{video_address}"
            async with session.post(
                api_url, json={"status": status, "adminKey": ADMIN_KEY}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    await callback_query.answer(
                        f"Video {status} successfully!", show_alert=True
                    )

                    # Update the message to show it's been processed
                    await bot.edit_message_text(
                        chat_id=callback_query.message.chat.id,
                        message_id=callback_query.message.message_id,
                        text=f"{callback_query.message.text}\n\n✅ STATUS: {status.upper()}",
                        reply_markup=None,
                    )
                else:
                    error_data = await response.json()
                    logging.error(f"API error: {error_data}")
                    await callback_query.answer(
                        f"Error: {error_data.get('error', 'Unknown error')}",
                        show_alert=True,
                    )
    except Exception as e:
        logging.error(f"Error processing validation: {e}")
        await callback_query.answer(
            "An error occurred while processing your request.", show_alert=True
        )


@router.message(Command("help"))
async def help_command(message: Message):
    """Send help information about the bot"""
    help_text = (
        "🤖 <b>O0 Network Bot Commands</b>\n\n"
        "/start - Start the bot and get the main menu\n"
        "/help - Show this help message\n\n"
        "Use the Launch App button to create and manage video notes."
    )
    await message.answer(help_text, parse_mode="HTML")


async def main():
    if not TOKEN:
        logging.critical(
            "Bot token not found. Please set the TOKEN environment variable."
        )
        return

    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    logging.basicConfig(level=logging.INFO, format=log_format)
    logging.getLogger("aiogram").setLevel(logging.INFO)

    bot = Bot(token=TOKEN)
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)

    logging.info("Starting bot polling...")
    try:
        await bot.get_me()
        logging.info("Bot token is valid.")
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    except Exception as e:
        logging.critical(f"Bot polling failed: {e}", exc_info=True)
    finally:
        logging.info("Closing bot session...")
        await bot.session.close()
        logging.info("Bot session closed.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Bot stopped manually.")
    except Exception as e:
        logging.critical(f"Unhandled exception in main: {e}", exc_info=True)
