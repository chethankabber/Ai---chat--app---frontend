// ============================================================
//  src/api/chat.js
//  🔧 UPDATE THIS FILE WITH YOUR OWN API DETAILS
// ============================================================

// ── Step 1: Set your API base URL ───────────────────────────
//  Examples:
//    OpenAI:    "https://api.openai.com/v1/chat/completions"
//    Anthropic: "https://api.anthropic.com/v1/messages"
//    Your own:  "https://your-backend.com/api/chat"
//    Local:     "http://localhost:3001/api/chat"
const API_URL = "http://192.168.100.53:11434/api/generate";  // ← CHANGE THIS

// ── Step 2: Set your API Key (use .env in production!) ──────
//  Create a .env file in the root with:
//    REACT_APP_API_KEY=your_key_here
//  Then access it as: process.env.REACT_APP_API_KEY
const API_KEY = process.env.REACT_APP_API_KEY || "YOUR_API_KEY_HERE"; // ← CHANGE THIS

// ── Step 3: Build the request body ──────────────────────────
//  The function below shows a generic shape.
//  Adjust the body format to match your API's expected schema.
//
//  OpenAI example body:
//    { model: "gpt-4o", messages: [...], temperature: 0.7 }
//
//  Anthropic example body:
//    { model: "claude-sonnet-4-20250514", max_tokens: 1024, messages: [...] }
//
//  Custom backend: whatever your server expects

function buildRequestBody(messages) {
  // Convert conversation history to a single prompt string
  const prompt = messages.map(m => 
    m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`
  ).join('\n') + '\nAssistant:';

  return {
    model: "llama3.2",
    prompt: prompt,
    stream: false,
  };
}

// ── Step 4: Parse the response ───────────────────────────────
//  Different APIs return text in different shapes.
//  Update this to extract the assistant's reply from the response.
//
//  OpenAI:    data.choices[0].message.content
//  Anthropic: data.content[0].text
//  Custom:    data.reply  or  data.text  etc.

function parseResponse(data) {
  return data?.response || "No response received.";
}

// ── Step 5: Set request headers ─────────────────────────────
//  Most APIs need Authorization + Content-Type.
//  Anthropic also needs: "anthropic-version": "2023-06-01"
//  Add or remove headers as needed.

function buildHeaders() {
  return {
    "Content-Type": "application/json",
  };
}
// ============================================================
//  sendMessage — called by useChat.js
//  DO NOT change the function signature.
//  conversationHistory: { role, content }[]
//  Returns: string (the AI's reply)
// ============================================================
export async function sendMessage(conversationHistory) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(buildRequestBody(conversationHistory)),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${errorText || response.statusText}`);
  }

  const data = await response.json();
  return parseResponse(data);
}
