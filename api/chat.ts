// Vercel Serverless Function for Ask Yogiri AI Chatbot
// Keeps your GEMINI_API_KEY securely stored on the cloud server.

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const apiKey = (rawKey || '').trim().replace(/\.+$/, '');

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const { messages, language = 'id' } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const langInstruction =
      language === 'en'
        ? '\n[CRITICAL LANGUAGE DIRECTIVE]: The user has set the website interface to ENGLISH. You MUST formulate your response in fluent, professional English (unless the user explicitly commands another language).'
        : '\n[CRITICAL LANGUAGE DIRECTIVE]: Pengguna memilih antarmuka BAHASA INDONESIA. Anda WAJIB merespon dalam Bahasa Indonesia yang profesional, ramah, dan tertata rapi (kecuali diminta bahasa lain secara spesifik).';

    // System prompt definition
    const systemPrompt = `Kamu adalah "Ask Yogiri", asisten AI resmi dari portofolio Fakhri Dinal Maulana Putra (Yogiri), AI/ML & Agentic Systems Specialist. Jawab pertanyaan seputar keahlian, proyek (Collaborative AI Agent Orchestrator, Enterprise Knowledge RAG, Vegetable Detection PyTorch), dan kontak (godofwar085793692785@gmail.com, WA: +62 857-9369-2785, GitHub: Yogiri19). Bersikaplah ramah, profesional, cerdas, dan format jawaban dengan markdown yang rapi.${langInstruction}`;

    const contents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data: any = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak ada respon.';

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('API Chat Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
