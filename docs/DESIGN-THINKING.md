# Design Thinking kit — Digital Skills with Maha

What the `llm-style` branch is for: **test two homepage ideas with real visitors** (Chat vs Classic) and **capture every enquiry** (email + WhatsApp). Use this kit to close the gaps.

| Stage | What was missing | How this branch / kit fixes it |
|---|---|---|
| **Empathize** | No conversations with Maha or her students | Interview guides below; the chat shows what people ask; enquiries show who they are (role, interest, language) |
| **Define** | No problem statement or success measure | Template + 3 metrics below |
| **Ideate** | One idea built, never compared | Two styles live: `?style=chat` and `?style=classic` |
| **Prototype** | Guesses as content | Content files to replace: `src/i18n/dictionary.ts`, `public/content/*.json`, `src/lib/assistant.ts` |
| **Test** | Only technical tests | 5-person test script below + weekly enquiry review |

## 1. Empathize — interview guides

**Maha (30 min)**
1. Who are your best students/clients? Who do you want more of?
2. What do people ask you again and again on WhatsApp? (list the top 10)
3. What stops interested people from joining?
4. How many enquiries can you handle per week? How fast can you reply?
5. Which services earn most, and which do you enjoy most?

**Students / customers (10–15 min each, 5 people)**
1. How did you first find Maha?
2. What were you worried about before contacting her?
3. Do you prefer reading, watching a video or chatting on WhatsApp?
4. Telugu or English for learning? Typing or speaking?
5. What would make you recommend her to a friend?

Also read Maha's **last 50 WhatsApp enquiries** and note the exact words people use.

## 2. Define — fill this in

> **[Persona]** needs **[a way to …]** because **[insight from interviews]**.

Example: *"Small shop owners in AP/Telangana need a quick, trusted way to learn which online skill will bring customers, because they're afraid of wasting money on courses they can't follow."*

**Success measures (check weekly)**
- Enquiries received (emails from the form)
- % of enquiries that become students/clients
- Which page style the enquiry came from (shown in every email as "Page style")

## 3. Ideate
- Share two links with different groups: `…/?style=chat` and `…/?style=classic`.
- After 2–3 weeks, compare the "Page style" field in the enquiry emails.

## 4. Prototype — replace these before testing
- [ ] Maha's real WhatsApp number and email (`src/lib/site.ts`)
- [ ] Web3Forms access key (`src/lib/site.ts` → `enquiry.web3formsKey`)
- [ ] Real reviews (with permission) in `public/content/testimonials.json`
- [ ] Maha's real FAQ answers in `src/lib/assistant.ts`
- [ ] Telugu reviewed by a native speaker (`src/i18n/dictionary.ts`)

## 5. Test — 5-person phone test (15 min each)
Give the link on their own phone. Say: *"Think aloud. There are no wrong answers."*
1. "You run a small shop and want more customers. Find out how Maha can help."
2. "Ask Maha a question in Telugu, by typing or by speaking."
3. "Register your interest in a class."

Write down: where they hesitate, what they misread, what they say. Ask after: *"What was confusing? Would you trust this? Chat or Classic — which felt easier?"*

Fix the top 3 problems → test again with 3 new people.
