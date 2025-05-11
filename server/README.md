# o0 Server

Backend server for the o0 app using Fastify and IPFS for data storage.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

   For development with auto-restart on file changes:

   ```bash
   npm run dev
   ```

## API Endpoints

- **POST /api/store**: Store data in IPFS. Send JSON data in the request body.
- **GET /api/retrieve/:cid**: Retrieve data from IPFS using the content ID.
- **GET /api/pitches/**: Access static video files.
- **POST /api/bot/start**: Mock endpoint for bot start command, returns video note URL and keyboard configuration.

## Bot Functionality

- On start, sends a video note with confetti effect.
- Follows up with a message: 'Visit o0.network to learn more about mechanism'.
- Provides a persistent 'Lunch App' button in the keyboard.
