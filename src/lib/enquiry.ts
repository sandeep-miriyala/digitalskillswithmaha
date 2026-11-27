import type { Dictionary } from "@/i18n/dictionary";
import { site } from "@/lib/site";

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  role: string;
  interests: string[];
  mode: string;
  language: string;
  message: string;
};

export const emptyEnquiry: Enquiry = {
  name: "",
  phone: "",
  email: "",
  role: "",
  interests: [],
  mode: "",
  language: "",
  message: "",
};

/** Indian mobile: optional +91 / 0, then 10 digits starting 6–9. */
export function normalisePhone(raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Errors = Partial<Record<keyof Enquiry | "consent", string>>;

export function validate(e: Enquiry, consent: boolean, t: Dictionary["register"]): Errors {
  const errors: Errors = {};
  if (e.name.trim().length < 2) errors.name = t.errRequired;
  if (!normalisePhone(e.phone)) errors.phone = t.errPhone;
  if (e.email.trim() && !EMAIL.test(e.email.trim())) errors.email = t.errEmail;
  if (!e.role) errors.role = t.errRequired;
  if (e.interests.length === 0) errors.interests = t.errInterests;
  if (!consent) errors.consent = t.errConsent;
  return errors;
}

/** The text Maha receives on WhatsApp (and that's mirrored in the email). */
export function enquiryText(e: Enquiry, t: Dictionary["register"]) {
  const lines = [
    `*${t.waHeader}*`,
    `${t.name}: ${e.name.trim()}`,
    `${t.phone}: +91 ${normalisePhone(e.phone) ?? e.phone}`,
    e.email.trim() ? `Email: ${e.email.trim()}` : "",
    `${t.role}: ${e.role}`,
    `${t.interests}: ${e.interests.join(", ")}`,
    e.mode ? `${t.mode}: ${e.mode}` : "",
    e.language ? `${t.language}: ${e.language}` : "",
    e.message.trim() ? `${t.message.replace(/\s*\(.*\)$/, "")}: ${e.message.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export const whatsappEnquiryLink = (text: string) =>
  `https://wa.me/${site.enquiry.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export const emailConfigured = () => site.enquiry.web3formsKey.trim().length > 0;

/**
 * Sends the enquiry to Maha's email via Web3Forms (free, works from static sites).
 * Throws on failure so the UI can offer WhatsApp instead.
 */
export async function sendEnquiryEmail(e: Enquiry, meta: { pageLang: string; pageStyle: string; botcheck: boolean }) {
  if (!emailConfigured()) throw new Error("Email not configured");
  const phone = normalisePhone(e.phone) ?? e.phone;
  const body = {
    access_key: site.enquiry.web3formsKey,
    subject: `New enquiry: ${e.name.trim()} — ${e.interests.join(", ")}`,
    from_name: `${site.name} website`,
    // Reply-to the visitor if they gave an email
    ...(e.email.trim() ? { email: e.email.trim() } : {}),
    Name: e.name.trim(),
    "WhatsApp / Phone": `+91 ${phone}`,
    "WhatsApp link": `https://wa.me/91${phone}`,
    "I am a": e.role,
    "Interested in": e.interests.join(", "),
    "Wants to": e.mode || "—",
    "Preferred language": e.language || "—",
    Message: e.message.trim() || "—",
    "Submitted at": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    "Website language": meta.pageLang,
    "Page style": meta.pageStyle,
    botcheck: meta.botcheck,
  };

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15_000);
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || !data.success) throw new Error(data.message || `Web3Forms ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}
