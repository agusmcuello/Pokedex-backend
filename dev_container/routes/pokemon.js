const express = require("express");
const router = express.Router();
const {
  getPokemon,
  getAllPokemon,
  postNewPokemon,
  updatePokemon,
} = require("../controllers/pokemon");

router.get("/pokemon/:nombrePokemon", getPokemon);
router.get("/pokemon", getAllPokemon);
router.post("/agregarPokemon", postNewPokemon);
router.put("/modificarPokemon/:nombre", updatePokemon);

module.exports = router;
