# Chemistry AI — Starter App

A responsive, installable-style web app starter for Android/mobile. It includes:
- Home dashboard
- Chemistry tutor chat interface
- 15 original starter topic outlines for BS-to-MS study
- 5-question quiz
- Responsive design and basic offline caching
- Optional AI backend using a Cloudflare Worker and Gemini API

## Important
This is a starter implementation, not a complete textbook or a substitute for checking scientific claims. The live AI chat will not work until you deploy the Worker, add a secret API key, and paste the Worker URL into `app.js`.

## Part A — Publish the website with GitHub Pages (Android-friendly)

1. Download and extract the ZIP.
2. Open your GitHub repository in Chrome.
3. Tap **Add file → Upload files**.
4. Upload `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, and `sw.js` from this folder. Upload `worker.js` only as a reference for the backend; GitHub Pages does not run it as a server.
5. Commit the changes.
6. In repository **Settings → Pages**, select deploy from branch, branch `main`, folder `/(root)`, then Save.
7. Wait for deployment and open your GitHub Pages URL.

The site and its local library/quiz can run without an AI key. The chat needs Part B.

## Part B — Enable live AI chat securely

### 1. Create a Gemini API key
1. Open Google AI Studio: https://aistudio.google.com/
2. Sign in and create an API key if the service is available to your account/region.
3. Do not share the key or put it in `app.js`, GitHub, screenshots or public chat.
4. Check current usage limits and terms: https://ai.google.dev/gemini-api/docs/pricing

### 2. Deploy the Worker
1. Create/sign in to a Cloudflare account: https://dash.cloudflare.com/
2. Open **Workers & Pages** and create a Worker.
3. Paste the code from `worker.js` into the Worker editor and deploy it.
4. In Worker settings, add an encrypted secret named `GEMINI_API_KEY` with your API key as its value.
5. If your Cloudflare UI does not allow the pasted module code directly, use the Workers editor's code view or the current Cloudflare quick-start instructions: https://developers.cloudflare.com/workers/get-started/guide/
6. Copy the deployed Worker URL.

### 3. Connect the app
Open `app.js` and find:
`const CHEMISTRY_AI_CONFIG = { workerUrl: "PASTE_YOUR_CLOUDFLARE_WORKER_URL_HERE" };`
Replace only the placeholder string with your Worker URL, keep the quotation marks, save and upload the changed `app.js` to GitHub.

### Security and cost notes
- Never put a secret API key in frontend JavaScript.
- This example is a learning prototype, not production-hardened. Before sharing publicly, add rate limiting, abuse protection, stricter CORS (replace `*` with your exact GitHub Pages origin), request-size limits and monitoring.
- API free tiers have limits and can change. Usage beyond a provider's free quota may cost money. Set provider-side limits/alerts where available.
- Avoid sending sensitive personal information. Review the AI provider's current data handling terms.
- The `gemini-2.5-flash` model name may change or become unavailable; check the provider's current model list if the Worker returns a model error.

## What to build next
- Add full original lessons and worked problems by chapter.
- Add saved bookmarks and study progress.
- Add account/login only after selecting a secure backend.
- Test the site on multiple Android screen sizes.
- A Play Store Android package is a separate later project.
