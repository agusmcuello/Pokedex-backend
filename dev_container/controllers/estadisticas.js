const listaPokemon = require("../models/listaPokemon");

exports.getStats = (req, res) => {
  const { nombrePokemon } = req.params;
  const pokemon = listaPokemon.find(
    (p) => p.nombre.toLowerCase() === nombrePokemon.toLowerCase()
  );
  const estadisticas = pokemon.estadisticas;
  console.log(estadisticas);
  res.send(estadisticas);
};
