# Genius Game

Clássico de memória em quatro cores — agora em TypeScript, com build Vite e visual atualizado.

## Como jogar

1. Ligue o aparelho (ON).
2. Aperte **start** e observe a sequência.
3. Repita as cores na mesma ordem.
4. Ative **strict** se quiser reinício total a cada erro.

[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://genius-game.netlify.app)

## Stack

- TypeScript
- Vite
- CSS moderno (sem wallpaper de madeira)

## Desenvolvimento

```bash
npm install
npm run dev
```

Opcional: copie `.env.example` para `.env` e defina `VITE_GA_MEASUREMENT_ID` para analytics (só carrega após consentimento).

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  main.ts
  consent.ts
  game/          # engine tipado
  styles/
public/          # sons, favicons, robots, sitemap
```

Feito por Filipe Almeida — [contato](mailto:filipecalm@gmail.com)
