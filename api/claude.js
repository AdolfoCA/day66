// Day 66: one small function on Vercel. The phone sends a prompt (and a meal photo);
// this asks Claude with the key kept here, never on the phone, and returns JSON.
module.exports = async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === 'GET') { res.status(200).json({ ok: true, configured: !!key }); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  if (!key) { res.status(401).json({ error: 'ANTHROPIC_API_KEY is not set in Vercel' }); return; }
  try {
    const { prompt, image, mediaType, tier } = req.body || {};
    if (!prompt) { res.status(400).json({ error: 'No prompt' }); return; }
    const model = tier === 'quick' ? (process.env.ANTHROPIC_MODEL_QUICK || 'claude-haiku-5-5') : (process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5');
    const content = [];
    if (image) content.push({ type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } });
    content.push({ type: 'text', text: prompt + '\n\nReturn only the JSON object: no prose, no code fences.' });
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 800, messages: [{ role: 'user', content }] })
    });
    const j = await r.json();
    if (!r.ok) { res.status(502).json({ error: (j.error && j.error.message) || 'Anthropic API error' }); return; }
    const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
    const m = text.match(/\{[\s\S]*\}/);
    let out;
    try { out = JSON.parse(m ? m[0] : text); } catch (e) { res.status(502).json({ error: 'The answer was not JSON', text }); return; }
    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
