// Cloudflare Worker: secure Gemini API proxy for Chemistry AI.
// Set GEMINI_API_KEY as a Worker secret in Cloudflare. Do not place the key in app.js.
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return reply({ error: "Use POST." }, 405, cors);
    if (!env.GEMINI_API_KEY) return reply({ error: "Server API key is not configured." }, 500, cors);

    try {
      const body = await request.json();
      const prompt = String(body.prompt || "").slice(0, 18000);
      if (!prompt) return reply({ error: "Question is empty." }, 400, cors);

      // Check Google's current model availability/pricing before changing this model.
      const model = "gemini-2.5-flash";
      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1800 }
          })
        }
      );
      const data = await upstream.json();
      if (!upstream.ok) return reply({ error: data?.error?.message || "AI provider request failed." }, upstream.status, cors);
      const text = (data.candidates || []).flatMap(c => c.content?.parts || []).map(p => p.text || "").join("\n");
      if (!text) return reply({ error: "No text answer returned. Try again." }, 502, cors);
      return reply({ text }, 200, cors);
    } catch (e) {
      return reply({ error: "Invalid request or upstream connection error." }, 400, cors);
    }
  }
};

function reply(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
  });
}
