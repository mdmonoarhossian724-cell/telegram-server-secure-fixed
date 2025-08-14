# Telegram Server (Secure)

This server forwards messages to your Telegram group while keeping your bot token and chat ID hidden.
It enforces a shared SECRET_KEY so only your extension can send messages.

## Endpoints
- `GET /` → healthcheck
- `POST /send-message` → body: `{ "text": "message text", "secretKey": "YOUR_SECRET_KEY" }`

## Env Vars
- `BOT_TOKEN` → Telegram bot token (from @BotFather)
- `CHAT_ID` → Your Telegram group chat ID (negative integer)
- `SECRET_KEY` → A strong shared secret (same value must be used by your extension)

## Run locally
```bash
npm install
SECRET_KEY=change_me CHAT_ID=-100123456 BOT_TOKEN=123:ABC node server.js
```
