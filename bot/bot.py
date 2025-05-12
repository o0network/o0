import os
import logging
import asyncio

from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, Router
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    KeyboardButton,
    ReplyKeyboardMarkup,
    FSInputFile,
    WebAppInfo,
)

load_dotenv()
TOKEN = os.getenv("TOKEN")

logging.basicConfig(level=logging.INFO)

router = Router()

main_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(
                text="🔥 Launch App 🔥",
                web_app=WebAppInfo(
                    url="https://t.me/o0netbot/app?startapp=true&mode=fullscreen"
                ),
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
