const express = require("express");
const router = express.Router();
const {
  getPokemon,
  getAllPokemon,
  postNewPokemon,
  updatePokemon,
  deletePokemon,
} = require("../controllers/pokemon");

router.get("/pokemon/:nombrePokemon", getPokemon);
router.get("/pokemon", getAllPokemon);
router.post("/agregarPokemon", postNewPokemon);
router.put("/modificarPokemon/:nombre", updatePokemon);
router.delete("/borrarPokemon/:nombre", deletePokemon);

module.exports = router;
