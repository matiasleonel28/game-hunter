const express = require("express");
const axios = require("axios");
const cors = require("cors");
// Ya no necesitamos nintendo ni cheerio por ahora
// const cheerio = require("cheerio"); 

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "query missing" });

  console.log(`🔎 Buscando en Steam: "${q}"...`);

  try {
    // Solo buscamos en STEAM (La fuente confiable)
    const response = await axios.get("https://store.steampowered.com/api/storesearch", { 
      params: { term: q, cc: "AR", l: "spanish" } 
    });

    const results = response.data.items.map(item => {
      // Steam devuelve precios en USD para Latam (en la API), o ARS si está pesificado viejos.
      // Generalmente para cuentas AR devuelve precio final en centavos de USD.
      // Pero para mostrarlo lindo, asumimos que viene el dato crudo.
      
      return {
        id: `steam-${item.id}`,
        store: 'steam',
        name: item.name,
        image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/header.jpg`,
        // Precio original y final
        price: item.price ? item.price.final / 100 : 0,
        originalPrice: item.price ? item.price.initial / 100 : 0,
        link: `https://store.steampowered.com/app/${item.id}`,
        currency: 'USD' 
      };
    });

    console.log(`✅ Enviando ${results.length} juegos de Steam.`);
    res.json(results);

  } catch (error) {
    console.error("Error en Steam:", error.message);
    res.status(500).json({ error: "Error buscando juegos" });
  }
});

app.listen(3001, () => console.log("Backend Steam-Only listo en 3001 🚂"));