# Designic Milano — Homepage

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · lucide-react.
Tutta la UI vive in `app/page.tsx` (`DesignicMilanoHomepage`). Token di design in `tailwind.config.ts`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Brand rationale: Milano vs International

| | Designic International | Designic Milano |
|---|---|---|
| Base | Bianco, molte foto, accenti colore | **Dusty Blue `#544B71`** come campo + **carta calda `#F3F3EB`** per la lettura |
| Accento firma | Gradiente Blue Sky | **Dusty Green `#D9D6AB`** (il colore del logo Milano) |
| Tono | Corporate luminoso | Editoriale, galleria d'arte |
| Elemento grafico | Bracket + gradiente + pattern | **Solo il bracket** (linea 1px con tacche), usato come firma |
| Font | Inter | Inter (stessa famiglia = parentela), contrasto di scala più estremo, label maiuscole molto spaziate (eco di "M I L A N O") |

Regole rispettate dal brand book: tinta scura = colore principale, tinta chiara solo per superfici; gradiente lasciato a International; bracket come firma.

## Hero
Video image-to-video (Seedance 2.5, 720p, 6s) generato dalla foto GSP del portfolio, estratto in 120 frame WebP (`public/hero`) e scrubbato su `<canvas>` dallo scroll. Con `prefers-reduced-motion` mostra il frame statico e le didascalie.

## Contenuti
Tutti i testi e i dati provengono dai PDF del cliente (`copy`, `projects`, `installations`, `team` in cima a `app/page.tsx`). Foto estratte dal portfolio PDF (risoluzione limitata dalla sorgente).
