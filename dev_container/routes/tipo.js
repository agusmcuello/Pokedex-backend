const express = require("express");
const router = express.Router();
const { getType } = require("../controllers/tipo");

router.get("/tipo/:nombrePokemon", getType);

module.exports = router;
