# Telegram Mini App Integration

This project supports running as a Telegram Mini App. This README explains how to set up, run, and deploy the app to be used inside Telegram.

## Prerequisites

- Node.js and npm/yarn installed
- A Telegram bot (create one via [@BotFather](https://t.me/BotFather))

## Development

To run the app in development mode:

```bash
# Run the Telegram-specific version
yarn start:tg
```

This will:
1. Start the development server with Telegram-specific configuration
2. Use `index.telegram.tsx` as the entry point
3. Configure environment variables for the Telegram variant

### Important Notes on Development

When running outside Telegram, the app will display warnings in the console. The app will still run, but Telegram-specific features (like the MainButton, haptic feedback, etc.) won't work.

To test properly, you need to:
1. Deploy the app to a web server
2. Configure your Telegram bot to use the app
3. Test through Telegram

## Building for Production

To build the app for deployment:

```bash
# Build the Telegram Mini App version
yarn build:tg
```

This creates a production-ready build in the `web-build` directory.

## Deployment

1. Deploy the contents of the `web-build` directory to your web server.
2. Set up your Telegram bot to use your Mini App:
   - Go to [@BotFather](https://t.me/BotFather)
   - Select your bot
   - Go to Bot Settings → Menu Button
   - Set the button to open your deployed app URL

## Telegram Mini App Launch Parameters

When a Mini App is launched from Telegram, it receives several important parameters in the URL hash:

- `tgWebAppData`: Contains user data and authentication information
- `tgWebAppVersion`: The current version of Telegram Mini Apps
- `tgWebAppPlatform`: Telegram application identifier
- `tgWebAppThemeParams`: Theme parameters for consistent UI

## Troubleshooting

### LaunchParamsRetrieveError

If you see "LaunchParamsRetrieveError: Unable to retrieve launch parameters from any known source", this means you're trying to run the app outside of Telegram without proper mocking.

Solutions:
1. Run through Telegram
2. Check the URL hash - it should contain the Telegram parameters

### Theme/UI Issues

If the app doesn't match Telegram's theme:
- Make sure you're using the `ThemeParams` from the Telegram SDK
- Use the utility functions in `utils/telegramApp.ts`

## Resources

- [Telegram Mini Apps Documentation](https://docs.telegram-mini-apps.com/)
- [Telegram Mini Apps SDK Reference](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
