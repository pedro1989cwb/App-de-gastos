# Meus Gastos — controlador de gastos do trabalho

App simples estilo "recibo" para registrar gastos do trabalho e ver totais, direto do celular. Funciona offline: os dados ficam salvos só no aparelho (localStorage), sem precisar de internet nem servidor.

## Arquivos
- `index.html` — estrutura da página
- `style.css` — visual estilo recibo de papel
- `script.js` — lógica: adicionar, remover, filtrar por mês, totais, exportar CSV
- `manifest.json` + `sw.js` — permitem instalar como app e usar offline
- `icon-192.png` / `icon-512.png` — ícone do app

## Como colocar no seu celular (igual você já fez com a landing page)

1. Crie um repositório novo no GitHub (ex: `controlador-gastos`) e suba esses arquivos.
2. Vá em **Settings → Pages** do repositório, escolha a branch `main` e a pasta raiz, e salve.
3. Espere alguns minutos e acesse a URL que o GitHub Pages gerar (algo como `https://SEU-USUARIO.github.io/controlador-gastos/`) **pelo navegador do celular**.
4. No Android (Chrome): toque no menu (⋮) → **"Adicionar à tela inicial"** / **"Instalar app"**.
   No iPhone (Safari): toque em Compartilhar → **"Adicionar à Tela de Início"**.
5. Pronto — o app abre em tela cheia, com ícone próprio, como se fosse instalado de verdade. Os dados que você digitar ficam salvos só nesse celular, mesmo sem internet.

## Testando localmente antes de publicar
Com a extensão Live Server no VS Code (que você já usa), clique com o botão direito em `index.html` → **"Open with Live Server"**. O botão de exportar CSV e o cadastro de gastos funcionam normalmente; só o "instalar como app" (PWA) exige que esteja publicado num endereço https (como o GitHub Pages).

## Importante sobre os dados
Como os dados ficam salvos no armazenamento local do navegador do celular, **limpar os dados do navegador (ou trocar de celular) apaga o histórico**. Use o botão "Exportar planilha (CSV)" de vez em quando para guardar uma cópia de segurança — o arquivo abre direto no Excel, Google Sheets ou similar.
