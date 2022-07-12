const listaPokemon = require("../models/listaPokemon");

exports.getPokemon = (req, res) => {
  const { nombrePokemon } = req.params;
  const pokemon = listaPokemon.find(
    (p) => p.nombre.toLowerCase() === nombrePokemon.toLowerCase()
  );
  res.send(pokemon);
};
exports.getAllPokemon = (req, res) => {
  let listaFiltrada = listaPokemon;
  const { tipo } = req.query;
  if (tipo) {
    // const [tipo1, tipo2] = tipo.split(",");
    listaFiltrada = listaFiltrada.filter(
      (p) =>
        p.tipo.toLowerCase() === tipo.toLowerCase() ||
        p.tipoDos?.toLowerCase() === tipo.toLowerCase()
    );
  }
  res.send(listaFiltrada);
};

exports.postNewPokemon = (req, res) => {
  const pokemon = req.body;
  const nuevaLista = listaPokemon;
  nuevaLista.push(pokemon);
  res.send(nuevaLista[nuevaLista.length - 1]);
};

exports.updatePokemon = (req, res) => {
  const { nombre } = req.params;
  const { descripcion, hp } = req.body;
  const posicionPokemon = listaPokemon.findIndex(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
  );
  listaPokemon[posicionPokemon].descripcion = descripcion;
  listaPokemon[posicionPokemon].estadisticas.hp = hp;
  res.send(listaPokemon[posicionPokemon]);
};
