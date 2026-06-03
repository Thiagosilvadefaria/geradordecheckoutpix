module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Metodo nao permitido' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID obrigatorio' });

  try {
    const URL   = process.env.KV_REST_API_URL;
    const TOKEN = process.env.KV_REST_API_TOKEN;

    const r = await fetch(`${URL}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['GET', `co:${id}`]
      ])
    });

    const rj = await r.json();
    const result = rj[0]?.result;
    if (!result) return res.status(404).json({ error: 'Link nao encontrado ou expirado' });

    const dados = typeof result === 'string' ? JSON.parse(result) : result;
    return res.status(200).json(dados);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
