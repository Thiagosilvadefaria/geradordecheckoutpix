module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  const { id } = req.query;
  if (!id) { return res.status(400).json({ error: 'ID obrigatorio' }); }

  try {
    const UPSTASH_URL   = process.env.KV_REST_API_URL;
    const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return res.status(500).json({ error: 'Variaveis nao configuradas' });
    }

    const r = await fetch(`${UPSTASH_URL}/get/co:${id}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    const json = await r.json();

    if (!json.result) {
      return res.status(404).json({ error: 'Link nao encontrado ou expirado' });
    }

    const dados = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    return res.status(200).json(dados);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
