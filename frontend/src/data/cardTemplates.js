// Platzhalter-Kartenpool. Jede Karte ist am Ende ein fertiges Bild inkl.
// Text/Werten — hier per SVG generiert, damit die Komponenten schon so
// strukturiert sind, als käme `imageUrl` von einer echten Asset-Pipeline.
// Einfach `makeCardImage` durch einen Lookup auf echte Bilddateien ersetzen.

// export const CARD_TEMPLATES = [
//   { name: "Wutfunke", hue: 12 },
//   { name: "Wutbrand", hue: 18 },
//   { name: "Freudenkeim", hue: 46 },
//   { name: "Freudenblüte", hue: 42 },
//   { name: "Angstwelle", hue: 265 },
//   { name: "Trauerschleier", hue: 205 },
// ];

export const CARD_TEMPLATES = [
  { "name": "Kruggler", "filename": "001_Kruggler.png" },
  { "name": "Robi", "filename": "002_Robi.png" },
  { "name": "Robo", "filename": "003_Robo.png" },
  { "name": "Robella", "filename": "004_Robella.png" },
  { "name": "Regelwurm", "filename": "005_Regelwurm.png" },
  { "name": "Spinfli", "filename": "006_Spinfli.png" },
  { "name": "Schleggach", "filename": "007_Schleggach.png" },
  { "name": "Samtange", "filename": "008_Samtange.png" }
]

export function makeCardImage(name, hue) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="336" viewBox="0 0 240 336">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue},70%,32%)" />
          <stop offset="100%" stop-color="hsl(${hue + 24},55%,14%)" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="hsl(${hue},90%,70%)" stop-opacity="0.55" />
          <stop offset="100%" stop-color="hsl(${hue},90%,70%)" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="336" rx="16" fill="url(#bg)" />
      <rect width="240" height="336" rx="16" fill="url(#glow)" />
      <rect x="10" y="10" width="220" height="316" rx="10" fill="none" stroke="hsla(${hue},90%,85%,0.35)" stroke-width="2" />
      <circle cx="120" cy="150" r="52" fill="hsla(${hue},95%,88%,0.16)" />
      <circle cx="120" cy="150" r="30" fill="hsla(${hue},95%,90%,0.28)" />
      <text x="120" y="284" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="hsl(${hue},60%,95%)">${name}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

let idCounter = 1;
function nextId() {
  idCounter += 1;
  return `card-${idCounter}`;
}

export function drawRandomCard() {
  const template = CARD_TEMPLATES[Math.floor(Math.random() * CARD_TEMPLATES.length)];
  return {
    id: nextId(),
    name: template.name,
    imageUrl: `/cards/${template.filename}`,
  };
}
