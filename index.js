import express from "express";
import { v4 as uuidv4 } from "uuid";
import Jimp from "jimp";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/procesar-imagen", async (req, res) => {
  const { imagenUrl } = req.body;
  try {
    const image = await Jimp.read(imagenUrl);
    const processedImage = await image
      .resize(350, Jimp.AUTO)
      .grayscale()
      .quality(80);
    const nombreImagen = uuidv4().slice(0, 6) + "_uuid_foto.jpg";
    const outputPath = path.join(__dirname, "assets/img", nombreImagen);
    await processedImage.writeAsync(outputPath);
    res.sendFile(outputPath);
  } catch (error) {
    res.status(500).send("Error al procesar la imagen.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en el puerto http://localhost:${PORT}`);
});
