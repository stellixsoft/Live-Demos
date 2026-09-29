# StellixSoft demo page for garage door companies

A personalized sales page you send to garage door company owners after a call. It's a copy of the appliance repair demo, rewritten for garage doors: springs, openers, installs, door quotes and commissions. It asks two to four quick questions, then shows only the solutions that fit their business, in order of their biggest problem, with clickable demos.

Built with Next.js, React, Tailwind CSS and Firebase. Quote form emails via Nodemailer (SMTP) on Vercel.

---

## 1. Before you send it to anyone

`src/config.ts` is already filled from the main StellixSoft site:

- **Logo**: `public/stellixsoft-logo.png` (same asset as stellixsoft.com)
- **Phone**: `(847) 496-9803`
- **Email**: `info@stellixsoft.com` (display / mailto)
- **Booking**: `https://calendly.com/stellixsoft/15-minute-meeting`
- **Quote form**: posts to `/api/demo-lead` on this app, which emails `EMAIL_TO` via SMTP (`SMTP_*` env vars)

Still confirm before going live:

- `prices`: your real starting prices (current numbers are placeholders)
- `promises` / `nextSteps`: keep only what’s true for how you work
- `testimonial`: Doctor Appliance quote from the site — the page labels it as appliance repair, never as a garage door client. Confirm they’re happy to be named
- FAQ answers in `src/data/faq.ts`
- SMTP + `EMAIL_TO` + `NEXT_PUBLIC_SITE_URL` set in Vercel (see `.env.example`)

Demo screens use invented sample data and are labelled "Sample data" on the page. Don't replace them with made-up testimonials or client results. Add real ones only when you have them.

## 2. Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Try a personalized link:
http://localhost:3000/?b=joes-garage-doors&city=dallas&owner=joe

## 3. Personalized links

Add these to the end of the link you send:

| Parameter | Example | What it does |
|---|---|---|
| `b` | `joes-garage-doors` or `Joe's+Garage+Doors` | Business name in the headline and demos |
| `city` | `dallas` | City in the headline and website demo |
| `owner` | `joe` | "Joe, thanks for the call." |
| `size` | `solo`, `small`, `large` | Skips the team-size question (you learned it on the call) |
| `problem` | `found`, `calls`, `chaos`, `payments` | Skips the biggest-problem question |
| `skip` | `1` | Skips all questions and shows everything |
| `ref` | `cold-call-oct` | Your own tag, saved with the lead |

Example after a call with a 4-person shop in Houston:

```
https://garagedoor.stellixsoft.com/?b=Bayou+Garage+Door+Pros&city=houston&owner=maria&size=small
```

Tip: with `b=joes-garage-doors` the name shows as "Joes Garage Doors". To keep an apostrophe, write it with `+` for spaces: `b=Joe's+Garage+Doors`.

## 4. Put it on GitHub

1. Create an empty repository on GitHub, for example `stellixsoft/garagedoor-demo`.
2. In this folder:

```bash
git init
git add .
git commit -m "Garage door demo page"
git branch -M main
git remote add origin https://github.com/YOUR-USER/garagedoor-demo.git
git push -u origin main
```

The first push will run the deploy workflow and fail until step 5 is done. That's expected.

## Using the same Firebase project as the appliance page

You can keep both pages in one Firebase project, so all leads land in the same `leads` collection (each lead records the page it came from).

1. Create a second Hosting site: `firebase hosting:sites:create stellix-garagedoor` (any unique name).
2. In this project's `firebase.json`, add `"site": "stellix-garagedoor",` as the first line inside `"hosting"`.
3. Use the same Firebase config values and GitHub secrets as the appliance project, in this repo too.
4. Connect `garagedoor.stellixsoft.com` to that site in Hosting (step 7).

Skip "Set up Firebase" steps 1 and 3 below if the project already exists; the Firestore rules are shared.

## 5. Set up Firebase

1. Go to https://console.firebase.google.com and create a project (Google Analytics: on).
2. **Add a web app**: Project settings, Your apps, the `</>` icon. Copy the config values.
3. **Create a Firestore database**: Build, Firestore Database, Create database, production mode, a US region.
4. **Hosting**: Build, Hosting, Get started (you can click through the steps).
5. Install the Firebase tools and link this folder:

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pick your project, alias "default"
firebase deploy --only firestore:rules
```

6. Copy `.env.example` to `.env.local` and paste the config values from step 2. `npm run dev` now records visits and answers.

## 6. Automatic deploys from GitHub

**Create the deploy key:**
Firebase console, Project settings, Service accounts, **Generate new private key**. A JSON file downloads. Keep it private.

**Add GitHub secrets:**
GitHub repo, Settings, Secrets and variables, Actions, **New repository secret**. Add:

| Secret name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | The whole contents of the JSON file |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | from your web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | from your web app config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | from your web app config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | from your web app config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | from your web app config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | from your web app config |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | from your web app config (starts with `G-`) |

Then, in the repo, Actions tab, re-run the failed workflow (or push any change).

From now on:
- Push to `main` and the live site updates in about two minutes.
- Open a pull request and a bot comments a temporary preview link.

Alternative: `firebase init hosting:github` creates the service account and secret for you, but it also writes its own workflow files. If you use it, keep the ones in this repo and delete the new ones it adds.

## 7. Connect garagedoor.stellixsoft.com

1. Firebase console, Hosting, **Add custom domain**, enter `garagedoor.stellixsoft.com`.
2. Firebase shows DNS records. Add exactly those at the place that manages DNS for stellixsoft.com (GoDaddy, Namecheap, Cloudflare, etc.).
   - On Cloudflare, set the records to **DNS only** (grey cloud) until Firebase shows the domain as connected.
3. Wait for verification (minutes to a few hours). The SSL certificate is issued automatically.

## 8. Where answers and leads go

Every finished question flow, "Email us your sheet" click and quote request (with the services they picked) is saved in **Firestore, collection `leads`**. Open it in the Firebase console. The browser can only add records, never read them (see `firestore.rules`).

**Which sections each prospect viewed** is in **Analytics, Events** (`page_open`, `quiz_answer`, `section_view`, `demo_interact`, `quote_toggle`, `faq_open`, `cta_click`). Custom events can take up to a day to show.

### Optional: get a message for every lead

`functions/index.js` sends each new lead to a webhook (Slack, Discord, or a Make/Zapier scenario that forwards to email or WhatsApp). It needs the Blaze plan (a card on file; this volume should cost nothing).

```bash
cd functions && npm install && cd ..
firebase functions:secrets:set NOTIFY_WEBHOOK_URL    # paste your webhook URL
firebase deploy --only functions
```

## Project map

```
src/config.ts                 your contact details and prices
src/lib/flow.ts               questions to section order logic
src/lib/params.ts             reading the personalized link
src/lib/firebase.ts           saving leads and analytics (optional)
src/components/Ticket.tsx     the question flow
src/components/Experience.tsx page layout, section copy, closing
src/components/demos/         the five clickable demos
src/data/sample.ts            invented demo data
```

### How the order works

- Their biggest problem comes first.
- If they run on sheets or paper, "Sheets to software" comes second.
- The rest follow by team size. Solo owners see the operations hub last, labelled "for when you hire". Teams of 6+ see it first.

## Reusing it for another trade

Copy the project, change `src/data/sample.ts`, the copy in `Experience.tsx` and `Ticket.tsx`, and deploy another Vercel project (for example `hvac.stellixsoft.com`).

## Hosting

Deployed on **Vercel** so `/api/demo-lead` can send mail with Nodemailer. Set `SMTP_*`, `EMAIL_TO`, and `NEXT_PUBLIC_SITE_URL` in the Vercel project env. Firebase remains optional for analytics / lead backup only.
