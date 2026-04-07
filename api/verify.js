export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const correctPassword = (process.env.PRESENTATION_PASSWORD || '').trim();
  if (!correctPassword) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
    });
  }

  const { password } = body || {};

  if (password && password === correctPassword) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
