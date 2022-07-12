const listaPokemon = require("../models/listaPokemon");

exports.getMoves = (req, res) => {
  const { nombrePokemon } = req.params;
  const pokemon = listaPokemon.find(
    (p) => p.nombre.toLowerCase() === nombrePokemon.toLowerCase()
  );
  const movimientos = pokemon.movimiento;
  res.send(movimientos);
};
