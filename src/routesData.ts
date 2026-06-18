import { RouteDataMultilingual } from "./translations";

// Helper to download a custom GPX file for the chosen hiking route
export function downloadGPXFileMultilingual(route: RouteDataMultilingual, lang: 'ca' | 'es' | 'en') {
  const t = route.langs[lang];
  const pointsXml = route.gpxPoints
    .map(
      (p, i) => `      <trkpt lat="${p.lat}" lon="${p.lon}">
        <ele>${p.ele}</ele>
        <time>${new Date(Date.now() + i * 60000).toISOString()}</time>
      </trkpt>`
    )
    .join("\n");

  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="La Rutalopo Hiking Edition" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${t.name} - La Rutalopó</name>
    <desc>${t.description} - Patrimoni: ${t.patrimony}</desc>
    <link href="https://la-rutalopo-hikes.org"/>
    <author>
      <name>La Rutalopó</name>
    </author>
  </metadata>
  <trk>
    <name>${t.name}</name>
    <desc>Senderisme autònom - Ús sota responsabilitat de l'usuari</desc>
    <trkseg>
${pointsXml}
    </trkseg>
  </trk>
</gpx>`;

  const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `la_rutalopo_hike_${route.id}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to generate the custom printable simulated PDF "Passaloport" 
// with the hiker's personal name and chosen design style.
export function generatePassaloportDocument(hikerName: string, lang: 'ca' | 'es' | 'en') {
  const cleanName = hikerName.trim() ? hikerName.toUpperCase() : "SENDERISTA ANÒNIM";
  const stampDate = "8-13 Octubre 2026";

  const textDict = {
    ca: {
      title: "PASSALOPORT DE SENDERISME DE LA RUTALOPÓ",
      subtitle: "Document de Credencial Personal i Autònoma",
      instructions: "Troba les fites singulars a cada recorregut del Vinalopó. Sella cadascun dels espais en finalitzar la teua marxa sota el teu propi criteri i responsabilitat.",
      owner: "PROPIETARI/A",
      validity: "VALIDESA DE LA TROBADA",
      stampSpace: "ESPAI DE SEGELLAT AUTÒNOM",
      disclaimer: "Declaro que soc completament autònom i rebutjo reclamacions civils als creadors d'aquests tracks lliures.",
      stampText: "Sella aquí una vegada hagis gaudit del paratge: "
    },
    es: {
      title: "PASSALOPORT DE SENDERISMO DE LA RUTALOPÓ",
      subtitle: "Documento de Credencial Personal y Autónoma",
      instructions: "Encuentra los hitos singulares en cada recorrido del Vinalopó. Sella cada uno de los espacios al finalizar tu marcha bajo tu propio criterio y responsabilidad propia.",
      owner: "PROPIETARIO/A",
      validity: "VALIDEZ DEL ENCUENTRO",
      stampSpace: "ESPACIO DE SELLADO AUTÓNOMO",
      disclaimer: "Declaro que soy plenamente autónomo y rechazo reclamaciones civiles a los creadores de estos tracks libres.",
      stampText: "Sella aquí una vez hayas disfrutado del paraje: "
    },
    en: {
      title: "PASSALOPORT - LA RUTALOPÓ HIKING PLEDGE",
      subtitle: "Personal Trail Passport & Pledge Document",
      instructions: "Find key physical heritage ruins on each path. Verify your passage in each box voluntarily once you completed the loop on your own authority.",
      owner: "HIKER NAME",
      validity: "GATHERING VALIDITY",
      stampSpace: "AUTONOMOUS STAMP CARD SLOT",
      disclaimer: "I declare that I am completely self-reliant and expect no external safety sweep services.",
      stampText: "Check or stamp here upon completing: "
    }
  };

  const t = textDict[lang];

  // Let's generate a beautiful HTML/Text based print layout or simulated printable sheet
  // This will trigger an automatic download of a customized text/HTML document designed to look like an authentic retro passport, which they can print or keep!
  const passportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Passaloport - ${cleanName}</title>
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      background-color: #FAF7F2;
      color: #333;
      padding: 30px;
      max-width: 650px;
      margin: 0 auto;
      border: 3px double #6f3970;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #6f3970;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #6f3970;
    }
    .instructions {
      font-size: 11px;
      line-height: 1.4;
      background-color: #f1ebd9;
      padding: 10px;
      border-radius: 4px;
      margin: 15px 0;
    }
    .meta-box {
      border: 1px solid #6f3970;
      padding: 10px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .stamp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 25px;
    }
    .stamp-box {
      border: 2px dashed #D4A373;
      padding: 15px;
      height: 110px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 6px;
      background: #fff;
    }
    .stamp-title {
      font-size: 11px;
      font-weight: bold;
      color: #6f3970;
    }
    .stamp-slot {
      border: 1px dotted #ccc;
      height: 45px;
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #999;
    }
    .footer-legal {
      margin-top: 30px;
      font-size: 9px;
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      text-align: justify;
    }
    .badge {
      display: inline-block;
      background-color: #6f3970;
      color: #FAF7F2;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: bold;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 24px; margin-bottom: 5px;">🍇🏔️</div>
    <div class="title">${t.title}</div>
    <div style="font-size: 11px; color:#D4A373;">${t.subtitle}</div>
  </div>

  <div class="meta-box">
    <strong>• ${t.owner}:</strong> <span style="text-decoration: underline;">${cleanName}</span><br>
    <strong>• ${t.validity}:</strong> <span>${stampDate}</span> <span class="badge">AUTÒNOM</span>
  </div>

  <div class="instructions">
    <strong>[INFO]:</strong> ${t.instructions}
  </div>

  <h3>${t.stampSpace}</h3>
  <div class="stamp-grid">
    <div class="stamp-box">
      <div class="stamp-title">1. Senda dels Castells</div>
      <div style="font-size: 9px; color:#666;">BIC: Castell de Castalla & Villena</div>
      <div class="stamp-slot">[ ${t.stampText} _____________ ]</div>
    </div>
    
    <div class="stamp-box">
      <div class="stamp-title">2. Ombria del Cid</div>
      <div style="font-size: 9px; color:#666;">BIC: Forns de Calç i Pous de Neu</div>
      <div class="stamp-slot">[ ${t.stampText} _____________ ]</div>
    </div>

    <div class="stamp-box">
      <div class="stamp-title">3. Senda del Clot</div>
      <div style="font-size: 9px; color:#666;">BIC: Jaciment Promontori</div>
      <div class="stamp-slot">[ ${t.stampText} _____________ ]</div>
    </div>

    <div class="stamp-box">
      <div class="stamp-title">4. Balcó de l'Alacantí</div>
      <div style="font-size: 9px; color:#666;">Patrimoni Séquies de Tibi</div>
      <div class="stamp-slot">[ ${t.stampText} _____________ ]</div>
    </div>
  </div>

  <div class="footer-legal">
    <strong>DECLARACIÓ INDIVIDUAL:</strong> ${t.disclaimer}
    <br><br>
    <em>La Rutalopó és un mitjà altruista d'intercanvi de recorreguts i promoció del senderisme conscient. No organitzem el teu viatge, no configurem la teua farmaciola, ni garantim l'estat dels senders forestals de la Comunitat Valenciana de forma oficial. Roda, camina i respecta les vides tradicionals.</em>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #999;">
    Generat el ${new Date().toLocaleDateString()} des de la web oficial de la comunitat autòctona.
  </div>
</body>
</html>`;

  const blob = new Blob([passportContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `passaloport_${cleanName.toLowerCase().replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
