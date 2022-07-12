const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/estadisticas");

router.get("/estadisticas/:nombrePokemon", getStats);

module.exports = router;
