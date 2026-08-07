# Central de Ajuda — Lila Brand

Front-end em **Next.js 16 (App Router) + TypeScript + CSS Modules** da Central de Ajuda,
implementado a partir do design `Central de Ajuda.dc.html`.

## O que a página tem

- Barra de avisos com marquee infinito
- Header fixo com logo e selo "Central de ajuda"
- Hero com busca instantânea (FAQ + atalhos), atalhos rápidos em chips e estado "nada encontrado"
- Formulário de contato que **envia a mensagem por e-mail**
- Acordeão de dúvidas frequentes (a busca abre e rola até a resposta)
- CTA de WhatsApp, rodapé e botão flutuante de WhatsApp

## Rodando localmente

```bash
bun install
```

```bash
bun run dev
```

Abre em http://localhost:3000

## Configurar o envio de e-mail

Toda mensagem enviada no formulário cai em **lilaabrand@gmail.com**
(definido em [lib/site-config.ts](lib/site-config.ts), sobrescrevível por `CONTACT_TO_EMAIL`).

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Depois escolha **uma** das opções abaixo.

### Opção A — Resend (recomendada)

1. Crie uma conta gratuita em https://resend.com
2. Gere uma API key em https://resend.com/api-keys
3. No `.env.local`:

```
RESEND_API_KEY=re_sua_chave_aqui
```

Sem domínio próprio verificado, o remetente fica `onboarding@resend.dev` — funciona
normalmente para receber. Com domínio verificado, preencha também
`CONTACT_FROM_EMAIL="Lila Brand <contato@seudominio.com.br>"`.

### Opção B — SMTP do Gmail

1. Ative a verificação em duas etapas na conta Google
2. Gere uma **Senha de app** em https://myaccount.google.com/apppasswords
3. No `.env.local`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=lilaabrand@gmail.com
SMTP_PASS=a_senha_de_app_de_16_letras
```

A senha normal do Gmail **não** funciona — precisa ser a senha de app.

> Se nenhuma das duas estiver configurada, o formulário responde
> "O envio de e-mail ainda não foi configurado neste site" e nada é enviado.

## Como o formulário funciona

`POST /api/contact` ([app/api/contact/route.ts](app/api/contact/route.ts)):

- valida nome, contato e mensagem
- só aceita assuntos da lista oficial
- descarta bots via campo honeypot invisível
- limita a 5 envios por IP a cada 10 minutos
- monta um e-mail HTML + texto e define `Reply-To` com o e-mail de quem escreveu,
  então basta responder na própria caixa de entrada
- o e-mail é disparado no **envio** do formulário (não a cada tecla digitada,
  para não encher a caixa de entrada de mensagens pela metade)

O link "Enviar essa mensagem por lá" continua abrindo o WhatsApp já com o texto
preenchido, como no design original.

## Deploy

Feito para a Vercel (`vercel deploy`) ou qualquer host Node. Lembre de cadastrar as
variáveis de ambiente no painel do host — `.env.local` não vai para o repositório.

## Estrutura

```
app/
  layout.tsx              fonte Poppins, metadata
  page.tsx                composição da página
  globals.css             reset, tokens de cor, keyframes
  api/contact/route.ts    recebe o formulário e envia o e-mail
components/               um componente + um CSS Module por bloco da página
lib/
  site-config.ts          logo, WhatsApp, endereço, e-mail de destino
  faq.ts                  perguntas, atalhos, chips, assuntos
  search.ts               busca com normalização de acentos e ranking
  whatsapp.ts             montagem do link click-to-chat
  mailer.ts               Resend com fallback SMTP
  rate-limit.ts           limitador em memória
```
