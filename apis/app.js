// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API OK" }));

// Démarrage direct
const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("✅ DB synchronisée");
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ Erreur DB :", err));