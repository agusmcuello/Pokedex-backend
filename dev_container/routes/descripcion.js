const express = require("express");
const router = express.Router();
const { getDescription } = require("../controllers/descripcion");

router.get("/descripcion/:nombrePokemon", getDescription);

module.exports = router;
