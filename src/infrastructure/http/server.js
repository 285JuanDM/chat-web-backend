import cors from "cors";
import express from "express";
import { config } from "../../config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

app.listen(config.port, () => {
  console.log(`Servidor escuchando en puerto ${config.port}`);
});
