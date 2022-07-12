const listaPokemon = require("../models/listaPokemon");

exports.getDescription = (req, res) => {
  const { nombrePokemon } = req.params;
  const pokemon = listaPokemon.find(
    (p) => p.nombre.toLowerCase() === nombrePokemon.toLowerCase()
  );
  const descripcion = pokemon.descripcion;
  res.send(descripcion);
};
