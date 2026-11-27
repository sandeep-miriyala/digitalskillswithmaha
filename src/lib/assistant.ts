import type { Lang } from "@/i18n/dictionary";

/**
 * Built-in answers for the 24×7 assistant. Works everywhere, including GitHub Pages
 * (no server). On Netlify, questions not covered here go to the AI function.
 * Edit answers freely — keep both languages.
 */
export type Answer = {
  text: string;
  /** Show a "Talk to Maha on WhatsApp" button */
  whatsapp?: boolean;
  /** Show a "Register now" button (scrolls to the enquiry form) */
  register?: boolean;
  /** Show the matching service card (0 AI Video, 1 Poster, 2 Meta Ads, 3 Affiliate) */
  service?: number;
};
type Entry = { keys: string[]; en: Answer; te: Answer };

const FAQ: Entry[] = [
  {
    keys: ["service", "offer", "what do you do", "help with", "సేవ", "ఏమి చేస్తారు", "ఏ సేవలు"],
    en: { text: "Maha offers four services:\n• AI Video Creation\n• Poster Designing\n• Meta Ads (Facebook & Instagram)\n• Affiliate Marketing\nEach is available done-for-you or as step-by-step training.", register: true },
    te: { text: "మహా గారు నాలుగు సేవలు అందిస్తారు:\n• AI వీడియో క్రియేషన్\n• పోస్టర్ డిజైనింగ్\n• మెటా యాడ్స్ (Facebook & Instagram)\n• అఫిలియేట్ మార్కెటింగ్\nమీ కోసం చేసిపెడతారు, లేదా స్టెప్ బై స్టెప్ నేర్పిస్తారు.", register: true },
  },
  {
    keys: ["meta", "facebook ad", "instagram ad", "ads cost", "ad cost", "budget", "యాడ్", "ఖర్చు", "బడ్జెట్"],
    en: { text: "You can start Meta ads with a small daily budget, test for 3–5 days, then spend more on the ad that works. Maha will suggest a budget that fits your business.", service: 2 },
    te: { text: "మెటా యాడ్స్‌ను చిన్న రోజువారీ బడ్జెట్‌తో మొదలుపెట్టి, 3–5 రోజులు టెస్ట్ చేసి, బాగా పనిచేసే యాడ్‌పై ఎక్కువ ఖర్చు పెట్టవచ్చు. మీ వ్యాపారానికి సరిపడే బడ్జెట్‌ను మహా గారు సూచిస్తారు.", service: 2 },
  },
  {
    keys: ["video", "reel", "ai video", "వీడియో", "రీల్"],
    en: { text: "AI Video Creation: short Reels and promo videos made with AI tools — script, voice, editing and captions. Tip: show the result in the first 2 seconds.", service: 0 },
    te: { text: "AI వీడియో క్రియేషన్: AI టూల్స్‌తో చిన్న రీల్స్, ప్రమోషన్ వీడియోలు — స్క్రిప్ట్, వాయిస్, ఎడిటింగ్, క్యాప్షన్లతో. టిప్: ఫలితాన్ని మొదటి 2 సెకన్లలోనే చూపించండి.", service: 0 },
  },
  {
    keys: ["poster", "design", "canva", "flyer", "పోస్టర్", "డిజైన్"],
    en: { text: "Poster Designing: clean posters for offers, festivals and launches. One headline, one offer, one call to action — readable on a phone.", service: 1 },
    te: { text: "పోస్టర్ డిజైనింగ్: ఆఫర్లు, పండుగలు, లాంచ్‌ల కోసం స్పష్టమైన పోస్టర్లు. ఒక హెడ్‌లైన్, ఒక ఆఫర్, ఒక కాల్ టు యాక్షన్ — ఫోన్‌లో సులభంగా చదవగలిగేలా.", service: 1 },
  },
  {
    keys: ["affiliate", "earn", "income", "అఫిలియేట్", "సంపాద"],
    en: { text: "Affiliate Marketing: earn a commission by recommending products you trust. Maha teaches how to pick products, create content and share links honestly.", service: 3 },
    te: { text: "అఫిలియేట్ మార్కెటింగ్: మీరు నమ్మే ప్రొడక్ట్స్‌ను సిఫారసు చేసి కమీషన్ సంపాదించండి. ప్రొడక్ట్స్ ఎంచుకోవడం, కంటెంట్ తయారు చేయడం, లింక్స్ నిజాయితీగా షేర్ చేయడం మహా గారు నేర్పిస్తారు.", service: 3 },
  },
  {
    keys: ["class", "course", "join", "fee", "price", "batch", "learn", "register", "enquiry", "enroll", "క్లాస్", "కోర్సు", "చేర", "ఫీజు", "నేర్చుకో", "రిజిస్టర్"],
    en: { text: "To join a class or get fees and batch timings, fill the 1-minute registration form or message Maha on WhatsApp — she'll share the current details.", whatsapp: true, register: true },
    te: { text: "క్లాస్‌లో చేరడానికి లేదా ఫీజు, బ్యాచ్ టైమింగ్స్ కోసం 1 నిమిషం రిజిస్ట్రేషన్ ఫారమ్ నింపండి లేదా మహా గారికి WhatsApp చేయండి — ప్రస్తుత వివరాలు పంపిస్తారు.", whatsapp: true, register: true },
  },
  {
    keys: ["contact", "whatsapp", "call", "phone", "talk", "maha", "సంప్రది", "కాల్", "ఫోన్", "మాట్లాడ", "మహా"],
    en: { text: "The quickest way to reach Maha is WhatsApp.", whatsapp: true },
    te: { text: "మహా గారిని త్వరగా సంప్రదించడానికి WhatsApp ఉత్తమం.", whatsapp: true },
  },
  {
    keys: ["install", "app", "download", "ఇన్‌స్టాల్", "యాప్"],
    en: { text: "Tap “Install App” at the top of the page. On iPhone: open in Safari → Share → Add to Home Screen." },
    te: { text: "పేజీ పైన ఉన్న “యాప్ ఇన్‌స్టాల్” నొక్కండి. iPhone లో: Safari లో తెరవండి → Share → Add to Home Screen." },
  },
  {
    keys: ["hi", "hello", "hey", "namaste", "నమస్కారం", "హాయ్", "హలో"],
    en: { text: "Hello! How can I help? You can ask about services, Meta ads, AI videos, posters, affiliate marketing or classes." },
    te: { text: "నమస్కారం! మీకు ఎలా సహాయం చేయగలను? సేవలు, మెటా యాడ్స్, AI వీడియోలు, పోస్టర్లు, అఫిలియేట్ మార్కెటింగ్ లేదా క్లాసుల గురించి అడగండి." },
  },
];

const TELUGU = /[ఀ-౿]/;

/** Language of the question: Telugu script wins, otherwise the page language. */
export function detectLang(text: string, pageLang: Lang): Lang {
  return TELUGU.test(text) ? "te" : pageLang;
}

/** Best keyword match, or null when nothing matches. Short keys must match a whole word. */
export function findAnswer(question: string, lang: Lang): Answer | null {
  const q = ` ${question.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")} `;
  let best: Entry | null = null;
  let bestScore = 0;
  for (const entry of FAQ) {
    const score = entry.keys.reduce((n, k) => {
      const hit = k.length <= 3 ? q.includes(` ${k} `) : q.includes(k);
      return hit ? n + k.length : n;
    }, 0);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return best ? best[lang] : null;
}

/** AI endpoint (Netlify only). Empty on GitHub Pages → built-in answers only. */
export const chatEndpoint = process.env.NEXT_PUBLIC_CHAT_API ?? "";

export async function askAI(message: string, lang: Lang, history: { role: "user" | "assistant"; text: string }[]) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15_000);
  try {
    const res = await fetch(chatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang, history: history.slice(-6) }),
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error(`Chat API ${res.status}`);
    const data = (await res.json()) as { reply?: string | null };
    if (!data.reply) throw new Error("Empty reply");
    return data.reply;
  } finally {
    clearTimeout(timer);
  }
}
