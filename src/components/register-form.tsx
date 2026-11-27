"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Check, CheckCircle2, ClipboardList, Loader2, Mail, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useLanguage } from "@/i18n/language";
import { useSiteStyle } from "@/i18n/site-style";
import {
  emailConfigured,
  emptyEnquiry,
  enquiryText,
  sendEnquiryEmail,
  validate,
  whatsappEnquiryLink,
  type Enquiry,
  type Errors,
} from "@/lib/enquiry";
import { WhatsAppIcon } from "./brand-icons";
import { serviceVisuals } from "./chat-parts";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="flex items-center gap-1 text-xs font-semibold text-pink">
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-line bg-bg-soft px-3.5 text-[15px] text-ink placeholder:text-ink-soft/70 transition focus:border-gold focus:outline-none aria-[invalid=true]:border-pink";

function ChoiceGroup({
  name,
  label,
  options,
  value,
  onChange,
  multi = false,
  error,
  icons,
}: {
  name: string;
  label: string;
  options: string[];
  value: string | string[];
  onChange: (v: string) => void;
  multi?: boolean;
  error?: string;
  icons?: boolean;
}) {
  const isOn = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  return (
    <fieldset className="flex flex-col gap-2" aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined}>
      <legend className="mb-1.5 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => {
          const on = isOn(o);
          const v = icons && i < serviceVisuals.length ? serviceVisuals[i] : null;
          return (
            <label
              key={o}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-[13.5px] font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                on ? "border-gold bg-gold-bright/15 text-ink" : "border-line bg-bg-soft text-ink-soft hover:border-ink-soft/50"
              }`}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={name}
                value={o}
                checked={on}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {on ? (
                <Check className="size-4 text-gold" aria-hidden />
              ) : v ? (
                <v.Icon className="size-4" style={{ color: v.accent }} aria-hidden />
              ) : null}
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-err`} className="flex items-center gap-1 text-xs font-semibold text-pink">
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function RegisterSection() {
  const { lang, t } = useLanguage();
  const r = t.register;
  const { style } = useSiteStyle();
  const uid = useId();
  const [form, setForm] = useState<Enquiry>(emptyEnquiry);
  const [consent, setConsent] = useState(false);
  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sentText, setSentText] = useState<string | null>(null);

  const mail = useMutation({
    mutationFn: () => sendEnquiryEmail(form, { pageLang: lang, pageStyle: style, botcheck }),
  });

  const set = <K extends keyof Enquiry>(k: K, v: Enquiry[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const toggleInterest = (o: string) =>
    set("interests", form.interests.includes(o) ? form.interests.filter((x) => x !== o) : [...form.interests, o]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form, consent, r);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      document.getElementById(`${uid}-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const text = enquiryText(form, r);
    if (!emailConfigured()) {
      // No email key yet → go straight to WhatsApp so no enquiry is lost
      window.open(whatsappEnquiryLink(text), "_blank", "noopener");
      setSentText(text);
      return;
    }
    try {
      await mail.mutateAsync();
      setSentText(text);
    } catch {
      /* error UI below offers WhatsApp */
    }
  };

  const restart = () => {
    setForm(emptyEnquiry);
    setConsent(false);
    setErrors({});
    setSentText(null);
    mail.reset();
  };

  const id = (k: string) => `${uid}-${k}`;
  const interestOptions = [...t.services.items.map((s) => s.title), r.notSure];

  return (
    <section id="register" aria-labelledby="register-title" className="relative border-y border-line bg-bg-soft py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-script text-2xl text-gold">{r.eyebrow}</p>
          <h2 id="register-title" className="mt-1 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em]">
            {r.title}
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink-soft">{r.sub}</p>
          <ul className="mt-8 space-y-3 text-sm font-semibold">
            <li className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-gold">
                <Mail className="size-4" aria-hidden />
              </span>
              {lang === "te" ? "మహా గారికి వెంటనే ఈమెయిల్" : "Instant email to Maha"}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-[#22b35e]">
                <WhatsAppIcon className="size-4" />
              </span>
              {lang === "te" ? "WhatsApp లో ఒక్క ట్యాప్‌తో పంపండి" : "One-tap copy to her WhatsApp"}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-pink">
                <ClipboardList className="size-4" aria-hidden />
              </span>
              {lang === "te" ? "1 నిమిషం — ఫీజు ఉండదు" : "Takes 1 minute — no payment"}
            </li>
          </ul>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)] sm:p-9">
          <AnimatePresence mode="wait" initial={false}>
            {sentText ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
                role="status"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="grid size-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-400"
                >
                  <CheckCircle2 className="size-9" aria-hidden />
                </motion.span>
                <h3 className="font-display text-2xl font-extrabold">
                  {r.successTitle}, {form.name.trim().split(" ")[0]}!
                </h3>
                <p className="max-w-sm text-ink-soft">{r.successBody}</p>
                <a
                  href={whatsappEnquiryLink(sentText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#22b35e] px-5 font-bold text-white transition hover:brightness-110"
                >
                  <WhatsAppIcon className="size-5" />
                  {r.whatsappBtn}
                </a>
                <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-gold">
                  <RotateCcw className="size-4" aria-hidden />
                  {r.another}
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="flex flex-col gap-6">
                {/* Honeypot: hidden from people, bots fill it */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  checked={botcheck}
                  onChange={(e) => setBotcheck(e.target.checked)}
                  className="hidden"
                  aria-hidden
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id={id("name")} label={`${r.name} *`} error={errors.name}>
                    <input
                      id={id("name")}
                      data-reg="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                      maxLength={80}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${id("name")}-err` : undefined}
                      className={inputCls}
                    />
                  </Field>
                  <Field id={id("phone")} label={`${r.phone} *`} error={errors.phone} hint={r.phoneHint}>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-ink-soft">+91</span>
                      <input
                        id={id("phone")}
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        autoComplete="tel-national"
                        maxLength={14}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? `${id("phone")}-err` : undefined}
                        className={`${inputCls} pl-12`}
                      />
                    </div>
                  </Field>
                </div>

                <Field id={id("email")} label={r.email} error={errors.email}>
                  <input
                    id={id("email")}
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoComplete="email"
                    maxLength={120}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${id("email")}-err` : undefined}
                    className={inputCls}
                  />
                </Field>

                <div id={id("role")} tabIndex={-1}>
                  <ChoiceGroup name="role" label={`${r.role} *`} options={r.roles} value={form.role} onChange={(v) => set("role", v)} error={errors.role} />
                </div>
                <div id={id("interests")} tabIndex={-1}>
                  <ChoiceGroup
                    name="interests"
                    label={`${r.interests} *`}
                    options={interestOptions}
                    value={form.interests}
                    onChange={toggleInterest}
                    multi
                    icons
                    error={errors.interests}
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <ChoiceGroup name="mode" label={r.mode} options={r.modes} value={form.mode} onChange={(v) => set("mode", v)} />
                  <ChoiceGroup name="language" label={r.language} options={r.languages} value={form.language} onChange={(v) => set("language", v)} />
                </div>

                <Field id={id("message")} label={r.message}>
                  <textarea
                    id={id("message")}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder={r.messagePh}
                    rows={3}
                    maxLength={600}
                    className={`${inputCls} h-auto resize-y py-3`}
                  />
                </Field>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      id={id("consent")}
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }));
                      }}
                      aria-invalid={!!errors.consent}
                      className="mt-0.5 size-5 shrink-0 accent-[var(--gold)]"
                    />
                    <span className="text-ink-soft">{r.consent}</span>
                  </label>
                  {errors.consent && (
                    <p className="flex items-center gap-1 pl-8 text-xs font-semibold text-pink">
                      <AlertCircle className="size-3.5" aria-hidden />
                      {errors.consent}
                    </p>
                  )}
                </div>

                {mail.isError && (
                  <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-pink/40 bg-pink/10 p-4 text-sm">
                    <p className="font-semibold">{r.error}</p>
                    <a
                      href={whatsappEnquiryLink(enquiryText(form, r))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#22b35e] px-4 font-bold text-white"
                    >
                      <WhatsAppIcon className="size-4" />
                      {r.whatsappBtn}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mail.isPending}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gold-bright px-7 text-base font-extrabold text-navy shadow-[0_14px_40px_-14px_var(--ring)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
                >
                  {mail.isPending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <ClipboardList className="size-5" aria-hidden />}
                  {mail.isPending ? r.sending : r.submit}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
