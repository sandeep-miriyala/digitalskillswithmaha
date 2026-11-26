/**
 * Maha — 24×7 AI assistant (Netlify Function, POST /api/chat)
 *
 * Netlify → Site configuration → Environment variables:
 *   GEMINI_API_KEY  (required)  free key from https://aistudio.google.com/apikey
 *   GEMINI_MODEL    (optional)  model id, copy the exact id from AI Studio
 *   ALLOWED_ORIGIN  (optional)  e.g. https://digitalskillswithmaha.netlify.app
 *
 * The key stays on the server. Without a key the site falls back to built-in answers.
 */
import type { Config } from "@netlify/functions";

const DEFAULT_MODEL = "gemini-3.6-flash";
const MAX_MESSAGE = 500;

type Turn = { role: "user" | "assistant"; text: string };

const SYSTEM = `You are "Maha", the friendly 24x7 AI assistant on the website of Digital Skills with Maha.
Maha is an MCA graduate and digital marketing coach from the Telugu states. Tagline: "Learn One Skill. Every Day."
Services: AI Video Creation, Poster Designing, Meta Ads (Facebook & Instagram), Affiliate Marketing — done-for-you or taught step by step.
Rules:
- You are an AI assistant, not Maha herself. If asked, say so plainly.
- Reply in the user's language: Telugu (Telugu script) if they write Telugu, otherwise English.
- Be warm, simple and practical. Max 6 short lines. Use bullet points for steps.
- Never invent prices, fees, batch dates, results or guarantees. For fees, timings, bookings or anything personal, ask them to message Maha on WhatsApp.
- Never ask for OTPs, passwords, bank or card details.
- Stay on digital skills, marketing and Maha's services; politely decline unrelated topics.`;

const json = (body: unknown, status = 200, origin = "*") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
    },
  });

const handler = async (req: Request) => {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" },
    });
  }
  if (req.method !== "POST") return json({ reply: null }, 405, origin);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json({ reply: null }, 503, origin);

  let body: { message?: unknown; lang?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ reply: null }, 400, origin);
  }

  const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE);
  if (!message) return json({ reply: null }, 400, origin);
  const lang = body.lang === "te" ? "Telugu" : "English";
  const history: Turn[] = Array.isArray(body.history) ? (body.history as Turn[]).slice(-6) : [];

  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: String(h.text ?? "").slice(0, MAX_MESSAGE) }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: `${SYSTEM}\nThe website is currently shown in ${lang}.` }] },
        contents,
        generationConfig: { maxOutputTokens: 400, temperature: 0.4 },
      }),
    });
    if (!res.ok) return json({ reply: null }, 502, origin);
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() || null;
    return json({ reply }, 200, origin);
  } catch {
    return json({ reply: null }, 502, origin);
  }
};

export default handler;

export const config: Config = {
  path: "/api/chat",
  method: ["POST", "OPTIONS"],
};
