const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "query missing" });

  console.log(`🔎 Buscando en Steam: "${q}"...`);

  try {
    const response = await axios.get("https://store.steampowered.com/api/storesearch", { 
      params: { term: q, cc: "AR", l: "spanish" } 
    });

    const results = response.data.items.map(item => {
      return {
        id: `steam-${item.id}`,
        store: 'steam',
        name: item.name,
        
        // 👇 ACÁ ESTÁ EL CAMBIO CLAVE 👇
        // Mandamos la imagen pequeña como base. El frontend se encarga de intentar la HD.
        image: item.tiny_image || "https://via.placeholder.com/300x150?text=Sin+Imagen", 
        
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