// api/checkout.js — Serverless function (Vercel)
// Retorna os dados do checkout pelo ID

const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') { return res.status(405).json({ error: 'Método não permitido' }); }

  const { id } = req.query;
  if (!id) { return res.status(400).json({ error: 'ID obrigatório' }); }

  try {
    const raw = await kv.get('checkout:' + id);
    if (!raw) { return res.status(404).json({ error: 'Link não encontrado ou expirado' }); }
    const dados = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return res.status(200).json(dados);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
