# Digital Skills with Maha

> Learn One Skill. Every Day.

The website for **Digital Skills with Maha**, covering AI Video Creation, Poster Designing, Meta Ads and Affiliate Marketing.
It is an installable web app (PWA) with English and Telugu, dark and light themes, a 24×7 assistant named **Maha**, and a back-to-top button.
It deploys to **Netlify** (with AI chat) or **GitHub Pages** (with built-in answers only).

## Stack (all open source)

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Motion | Motion (`motion/react`), Lenis smooth scroll |
| Data | TanStack Query (loads `public/content/*.json`) |
| Theme | next-themes (dark / light / system) |
| Icons | Lucide, plus small inline brand icons |
| Fonts | Bricolage Grotesque, Manrope and Caveat, self-hosted via Fontsource (SIL OFL) |
| Languages | English + Telugu (`src/i18n/dictionary.ts`), Noto Sans Telugu font |
| 24×7 assistant | Built-in bilingual answers + optional Gemini AI via a Netlify Function |
| PWA | `app/manifest.ts` + hand-written `public/sw.js` (offline shell) |
| Hosting | Netlify (`netlify.toml`) or GitHub Pages (`.github/workflows/deploy.yml`) |

## Branch `llm-style` — what's new

- **Two page styles** with a **Chat | Classic** switch in the header (saved per visitor).
  - **Chat (LLM style):** "Hi, I'm Maha — What do you want to learn today?", a big ask box with **voice input**, 4 starter cards, a full conversation view with sidebar, service cards and follow-up chips.
  - **Classic:** the original hero plus the floating Maha chat.
  - Default style: `site.defaultStyle` in `src/lib/site.ts`. Force one with `?style=chat` or `?style=classic`.
- **Registration / Enquiry module** (`#register`): name, WhatsApp number, optional email, role, interests, mode, language, message and consent, with validation and spam protection.
  - **Email to Maha** automatically via **Web3Forms** (free, 250 per month).
  - **WhatsApp to Maha** with one tap: the whole enquiry is pre-typed in WhatsApp.
  - If email isn't set up, or fails, the form sends the visitor to WhatsApp instead, so no enquiry is lost.
- A design-thinking kit in `docs/DESIGN-THINKING.md`.

### One-time setup for enquiries
1. Go to **https://web3forms.com**, enter **Maha's email** → copy the **Access Key** from the email you receive.
2. In `src/lib/site.ts`:
   - `enquiry.web3formsKey: "PASTE-ACCESS-KEY"` (or set the `NEXT_PUBLIC_WEB3FORMS_KEY` env variable)
   - `enquiry.whatsappNumber: "919876543210"` (country code + number, digits only)
   - also `links.whatsapp` and `links.email`
3. Commit and push. Test by submitting the form once. Check Maha's inbox (and spam folder, the first time).

### Host this branch on its own URL (Netlify, free)
1. On app.netlify.com, choose **Add new site → Import an existing project → GitHub → digitalskillswithmaha**.
2. **Branch to deploy: `llm-style`** → **Deploy**. The other settings come from `netlify.toml`.
3. Rename it under **Site configuration → Change site name**, for example `maha-chat` → `https://maha-chat.netlify.app`.
4. Optional: add `NEXT_PUBLIC_WEB3FORMS_KEY` and `GEMINI_API_KEY` under **Environment variables**, then redeploy.

Your GitHub Pages site (from `main`) is unaffected. When you're happy, merge `llm-style` into `main`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

To preview the production build at the GitHub Pages path:

```bash
NEXT_PUBLIC_BASE_PATH=/digitalskillswithmaha npm run build
mkdir -p /tmp/site && cp -r out /tmp/site/digitalskillswithmaha
npx serve /tmp/site   # open /digitalskillswithmaha/
```

## Deploy to Netlify (recommended — includes AI chat)

1. Push the project to GitHub.
2. On netlify.com, choose **Add new site → Import an existing project → GitHub** and pick `digitalskillswithmaha`.
   `netlify.toml` already sets the build command (`npm run build`), the publish folder (`out`) and the functions folder.
3. Optional, to turn on AI answers: go to **Site configuration → Environment variables** and add
   `GEMINI_API_KEY` (a free key from aistudio.google.com/apikey). You can also add `GEMINI_MODEL`
   to choose a different model. Then redeploy.
4. Every push to `main` redeploys. Without a key, Maha still answers with the built-in replies.

Netlify CLI alternative:

```bash
npm i -g netlify-cli
netlify login
netlify init        # link or create the site
netlify deploy --build --prod
```

### Test the real AI chat on your computer

```bash
copy .env.example .env        # Mac/Linux: cp .env.example .env
# put your GEMINI_API_KEY in .env
npx netlify-cli dev           # opens http://localhost:8888 with /api/chat working
```

With plain `npm run dev`, Maha uses the built-in answers only.

## Deploy to GitHub Pages (one-time setup)

1. Push this project to the `digitalskillswithmaha` repository on the `main` branch.
2. On GitHub, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` builds and deploys the site. It goes live at
   `https://sandeep-miriyala.github.io/digitalskillswithmaha/`.

The base path comes from `actions/configure-pages`, so a custom domain added later needs no code change.

## Edit content (no code)

| What | Where |
|---|---|
| WhatsApp, Instagram, YouTube, email, site URL | `src/lib/site.ts` (look for `TODO`) |
| All page text, English + Telugu | `src/i18n/dictionary.ts` |
| "Skill of the day" tips (both languages) | `public/content/skills.json` |
| Testimonials | `public/content/testimonials.json`. The entries there are **samples**: replace them with real student reviews (with the student's permission) and set `"sample": false` |
| Maha's built-in chat answers | `src/lib/assistant.ts` |
| Maha's AI personality and rules | `netlify/functions/chat.mts` (`SYSTEM`) |
| Logo, favicons, app icons | `public/brand`, `public/icons`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico` |

After changing `public/sw.js` or the main assets, bump `VERSION` in `public/sw.js` so installed apps refresh.

## Project structure

```
src/
  app/          layout, page, manifest, icons
  components/   header, hero, services, testimonials, contact CTA, footer,
                chat-assistant (Maha), back-to-top, language & theme toggles
  i18n/         dictionary.ts (EN + TE), language.tsx
  lib/          site.ts (brand & links), assistant.ts (chat answers)
netlify/functions/chat.mts   AI endpoint /api/chat
netlify.toml
public/
  brand/ icons/ content/(skills, testimonials) sw.js og.png .nojekyll
.github/workflows/deploy.yml
```
