import { SYSTEM_PROMPT } from '../data/yogiriKnowledge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MODEL_NAME = 'gemini-3.6-flash';

// Clean API key (strip trailing dot or whitespace if present)
const getCleanApiKey = (): string => {
  const rawKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  return rawKey.trim().replace(/\.+$/, '');
};

/**
 * Send messages to Gemini API, with automatic fallback:
 * 1. Tries /api/chat (Serverless endpoint for Vercel/cloud hosting - keeps API key hidden).
 * 2. Falls back to direct Gemini API call (useful for local dev / static hosting).
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  language: 'id' | 'en' = 'id'
): Promise<string> {
  // Filter out any empty messages
  const validMessages = messages.filter((m) => m.content.trim().length > 0);
  if (validMessages.length === 0) {
    return language === 'en'
      ? 'Hello! How can I assist you regarding Yogiri’s profile or engineering skills?'
      : 'Halo! Ada yang bisa saya bantu terkait profil atau keahlian Yogiri?';
  }

  // Attempt 1: Try serverless endpoint (/api/chat)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: validMessages, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch {
    // If /api/chat is not available (e.g. localhost Vite dev server), proceed to fallback
  }

  // Attempt 2: Direct Gemini API call
  const apiKey = getCleanApiKey();
  if (!apiKey) {
    throw new Error('API Key Google Gemini belum dikonfigurasi.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const langInstruction =
    language === 'en'
      ? '\n[CRITICAL LANGUAGE DIRECTIVE]: The user has set the website interface to ENGLISH. You MUST formulate your response in fluent, professional English (unless the user explicitly commands another language).'
      : '\n[CRITICAL LANGUAGE DIRECTIVE]: Pengguna memilih antarmuka BAHASA INDONESIA. Anda WAJIB merespon dalam Bahasa Indonesia yang profesional, ramah, dan tertata rapi (kecuali diminta bahasa lain secara spesifik).';

  const fullSystemPrompt = `${SYSTEM_PROMPT}\n${langInstruction}`;

  // Format Gemini contents payload
  const contents = validMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const payload = {
    system_instruction: {
      parts: [{ text: fullSystemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API Error:', response.status, errorBody);
    throw new Error(
      language === 'en'
        ? `Gemini API error (${response.status}): Please verify internet connection or quota.`
        : `Gemini API error (${response.status}): Mohon periksa koneksi atau kuota API.`
    );
  }

  const result = await response.json();
  const replyText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!replyText) {
    throw new Error(
      language === 'en' ? 'No response from Gemini API.' : 'Tidak ada respon dari Gemini API.'
    );
  }

  return replyText;
}
