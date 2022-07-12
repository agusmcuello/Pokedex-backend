const listaPokemon = require("../models/listaPokemon");

exports.getType = (req, res) => {
  const { nombrePokemon } = req.params;
  const pokemon = listaPokemon.find(
    (p) => p.nombre.toLowerCase() === nombrePokemon.toLowerCase()
  );
  const tipo = pokemon.tipo;
  res.send(tipo);
};
