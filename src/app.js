import express from "express";
import path from "path";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";

// Controllers
import { articleController } from "./controllers/index.js";

// ES module resolve
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App
const _app = express();

const IMG_PATH = path.resolve(__dirname, "..", "public", "images");

// Multer file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMG_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Configs
_app.use(cors());
_app.use(express.json());
_app.use(express.urlencoded({ extended: true }));

// Routes
_app.use("/img", express.static(IMG_PATH));

// LISTAR TODAS AS POSTAGENS
_app.get("/postagem", articleController.get);

// LISTAR UMA POSTAGEM
_app.get("/postagem/:id", articleController.getOne);

// LISTAR POR CATEGORIA
_app.get("/postagem/categoria/:cat", articleController.getByCategory);

// CRIAR UMA POSTAGEM
_app.post("/postagem", upload.single("thumbImage"), articleController.create);

// APAGAR UMA POSTAGEM
_app.delete("/postagem/:id", articleController.delete);

export const app = _app;
