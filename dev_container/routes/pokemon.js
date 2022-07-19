const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  database: "pokedex",
  password: "8508",
});
const router = express.Router();
const {
  getPokemon,
  getAllPokemon,
  postNewPokemon,
  updatePokemon,
  deletePokemon,
  verifyToken,
  postLogin,
} = require("../controllers/pokemon");

const usuarios = [
  {
    name: "Juan",
    mail: "juan@gmail.com",
    password: "$2b$10$kKO2X7Hz419rDpxU7i5fH.I5BAWfxTvMjFPzU7tzGo3xibGZeX6OK",
  },
];

router.get("/pokemon/:nombrePokemon", getPokemon);
router.get("/pokemon", getAllPokemon);
router.post("/agregarPokemon", verifyToken, postNewPokemon);
router.put("/modificarPokemon/:nombre", verifyToken, updatePokemon);
router.delete("/borrarPokemon/:nombre", verifyToken, deletePokemon);
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const newUser = {
    name: req.body.name,
    mail: req.body.mail,
    password: password,
  };

  try {
    pool.query(
      "INSERT INTO public.usuarios (nombre, mail, password) VALUES ($1, $2, $3)",
      [newUser.name, newUser.mail, password]
    );
    res.json({ success: true, newUser, usuarios, salt });
  } catch (error) {
    res.json({ error: error });
  }
});

router.post("/login", postLogin);

module.exports = router;
