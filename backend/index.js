const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
  const q = req.query.q;
  
  // Validación: si no envían el parámetro q, devolvemos error
  if (!q) return res.status(400).json({ error: "query missing" });

  try {
    // Petición a la API de Steam
    const steamRes = await axios.get(
      "https://store.steampowered.com/api/storesearch",
      { params: { term: q, cc: "AR", l: "spanish" } } // cc: AR para precios en pesos (o referencia regional)
    );
    res.json(steamRes.data.items);
  } catch (e) {
    res.status(500).json({ error: "steam failed" });
  }
});

// Levantar el servidor en el puerto 3001
app.listen(3001, () => console.log("Backend listo en http://localhost:3001"));