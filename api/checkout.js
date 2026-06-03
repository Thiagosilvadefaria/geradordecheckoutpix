module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') { return res.status(405).json({ error: 'Método não permitido' }); }

  const { id } = req.query;
  if (!id) { return res.status(400).json({ error: 'ID obrigatório' }); }

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    const r = await fetch(`${url}/get/checkout:${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const json = await r.json();
    if (!json.result) { return res.status(404).json({ error: 'Link não encontrado ou expirado' }); }

    const dados = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    return res.status(200).json(dados);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
};
