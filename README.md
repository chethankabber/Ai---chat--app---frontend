# GT Chat — AI Chatbot UI

A clean, production-ready React chatbot interface. Plug in any AI API.

## Folder Structure

```
neural-chat/
├── public/
│   └── index.html              # HTML shell + Google Fonts
├── src/
│   ├── api/
│   │   └── chat.js             # 🔧 UPDATE THIS — API integration
│   ├── components/
│   │   ├── Header.jsx          # Top bar: title, clear, dark toggle
│   │   ├── MessageList.jsx     # Scrollable message feed + empty state
│   │   ├── Message.jsx         # User & AI bubbles + typewriter effect
│   │   ├── TypingIndicator.jsx # Animated dots while waiting
│   │   └── InputArea.jsx       # Textarea + send button
│   ├── hooks/
│   │   └── useChat.js          # All chat state & logic
│   ├── utils/
│   │   └── helpers.js          # formatTime, createMessage, localStorage
│   ├── styles/
│   │   └── index.css           # Tailwind + custom animations
│   ├── App.jsx                 # Root component
│   └── index.js                # React entry point
├── .env.example                # Copy to .env and add your API key
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up your API key
cp .env.example .env
# Edit .env → REACT_APP_API_KEY=your_key_here

# 3. Configure your API endpoint (see below)

# 4. Run
npm start
```

## 🔧 Connecting Your API

Open `src/api/chat.js` — it has 5 clearly marked sections:

| Step | What to change |
|------|---------------|
| 1 | `API_URL` — your endpoint URL |
| 2 | `API_KEY` — use `.env` for this |
| 3 | `buildRequestBody()` — shape of the POST body |
| 4 | `parseResponse()` — how to extract the reply text |
| 5 | `buildHeaders()` — Authorization header style |

### OpenAI example
```js
const API_URL = "https://api.openai.com/v1/chat/completions";
// buildRequestBody: { model: "gpt-4o", messages }
// parseResponse:   data.choices[0].message.content
// header:          "Authorization": `Bearer ${API_KEY}`
```

### Anthropic example
```js
const API_URL = "https://api.anthropic.com/v1/messages";
// buildRequestBody: { model: "claude-sonnet-4-20250514", max_tokens: 1024, messages }
// parseResponse:   data.content[0].text
// headers: add "anthropic-version": "2023-06-01", use "x-api-key" header
```

### Custom backend example
```js
const API_URL = "http://localhost:3001/api/chat";
// buildRequestBody: whatever your server expects
// parseResponse:   data.reply
// header:          your auth scheme
```

## Features

- ✅ Typewriter streaming effect for AI responses
- ✅ LocalStorage persistence (history survives refresh)
- ✅ Copy-to-clipboard per message
- ✅ Dark / light mode toggle
- ✅ Loading indicator (animated dots)
- ✅ Error banner on API failure
- ✅ Auto-scroll to latest message
- ✅ Auto-resize textarea
- ✅ Enter to send, Shift+Enter for newline
- ✅ Character counter (4000 max)
- ✅ Starter chips on empty state
- ✅ Responsive (mobile + desktop)

## Production Notes

- Never expose API keys in frontend code for production apps
- Run your API calls through a backend proxy (Next.js API routes, Express, etc.)
- Add rate limiting and authentication on your backend
