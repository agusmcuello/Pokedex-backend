const express = require("express");
const router = express.Router();
const { getMoves } = require("../controllers/movimientos");

router.get("/movimientos/:nombrePokemon", getMoves);

module.exports = router;
