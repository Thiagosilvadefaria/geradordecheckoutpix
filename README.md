# Checkout Pix

## Como hospedar no Vercel (5 minutos)

### 1. Criar conta no GitHub
- Acesse github.com e crie uma conta gratuita

### 2. Criar repositório no GitHub
- Clique em "New repository"
- Nome: `checkout-pix`
- Marque "Public"
- Clique em "Create repository"
- Faça upload de todos os arquivos desta pasta

### 3. Conectar ao Vercel
- Acesse vercel.com
- Clique em "Sign up" → entre com o GitHub
- Clique em "Add New Project"
- Selecione o repositório `checkout-pix`
- Clique em "Deploy"

### 4. Configurar o banco de dados (KV)
- No painel do Vercel, vá em "Storage"
- Clique em "Create Database" → escolha "KV"
- Nome: `checkout-db`
- Clique em "Create"
- Na aba "Settings" do KV, clique em "Connect Project"
- Selecione seu projeto `checkout-pix`
- Clique em "Connect"

### 5. Pronto!
- Seu link será algo como: `https://checkout-pix.vercel.app`
- Acesse essa URL para usar o gerador
- Os links gerados terão o formato: `https://checkout-pix.vercel.app/checkout.html?id=abc123`
- Links são curtos, funcionam no WhatsApp e expiram em 7 dias

## Estrutura dos arquivos
```
checkout-pix/
├── public/
│   ├── index.html      ← Gerador (você usa)
│   └── checkout.html   ← Checkout (seu cliente vê)
├── api/
│   ├── gerar.js        ← Salva dados e gera link
│   └── checkout.js     ← Busca dados pelo ID
├── package.json
├── vercel.json
└── README.md
```
