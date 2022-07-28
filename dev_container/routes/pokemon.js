const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  database: "pokemon",
  password: "lagatacamila",
  port:9090,
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

router.get("/pokemon/:nombrePokemon", getPokemon);
router.get("/pokemon", getAllPokemon);
router.post("/agregarPokemon", postNewPokemon);
router.put("/modificarPokemon/:nombre", verifyToken, updatePokemon);
router.delete("/borrarPokemon/:nombre", deletePokemon);
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
      "INSERT INTO public.usuarios (name, email, password) VALUES ($1, $2, $3)",
      [newUser.name, newUser.mail, password]
    );
    res.json({ success: true, newUser, salt });
  } catch (error) {
    res.json({ error: error });
  }
});
router.post("/login", postLogin);

module.exports = router;
