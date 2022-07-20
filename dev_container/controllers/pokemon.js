const listaPokemon = require("../models/listaPokemon");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  database: "pokemon",
  password: "lagatacamila",
  port:9090,
});
const bcrypt = require("bcrypt");

exports.getPokemon = (req, res) => {
  const { nombrePokemon } = req.params;
  const pokemonIndex = listaPokemon.findIndex(
    (p) => p.nombre.toLowerCase() === nombrePokemon.toLowerCase()
  );
  const pokemon = listaPokemon[pokemonIndex];
  const next =
    pokemonIndex !== listaPokemon.length - 1
      ? listaPokemon[pokemonIndex + 1].nombre
      : null;
  const prev =
    pokemonIndex !== 0 ? listaPokemon[pokemonIndex - 1].nombre : null;
  res.send({ ...pokemon, next, prev });
};
exports.getAllPokemon = (req, res) => {
  let listaFiltrada = listaPokemon;
  const { tipo, atk } = req.query;
  if (tipo) {
    const tipos = tipo.split(",");
    tipos.forEach((t) => {
      listaFiltrada = listaFiltrada.filter(
        (p) =>
          p.tipo.toLowerCase() === t.toLowerCase() ||
          p.tipoDos?.toLowerCase() === t.toLowerCase()
      );
    });
  }
  if (atk) {
    listaFiltrada = listaFiltrada.filter(
      (p) => parseInt(p.estadisticas.atk) > parseInt(atk)
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
  // const { descripcion, hp } = req.body;
  const nuevosValores = req.body;
  const posicionPokemon = listaPokemon.findIndex(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
  );
  const pokemonActualizado = {
    ...listaPokemon[posicionPokemon],
    ...nuevosValores,
  };
  listaPokemon[posicionPokemon] = pokemonActualizado;
  // listaPokemon[posicionPokemon].descripcion = descripcion;
  // listaPokemon[posicionPokemon].estadisticas.hp = hp;
  // res.send(listaPokemon[posicionPokemon]);
  res.send(listaPokemon[posicionPokemon]);
};

exports.deletePokemon = (req, res) => {
  const { nombre } = req.params;
  const posicionPokemon = listaPokemon.findIndex(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
  );
  const listaNueva = listaPokemon.splice(posicionPokemon, 1);
  // const listaFilter = listaPokemon.filter((p)=>p.nombre.toLowerCase!==listaPokemon[posicionPokemon].nombre.toLowerCase())
  res.send(listaPokemon);
};

const TOKEN_SECRET = "UnaClaveParaFirmarElToken";

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "acceso denegado" });
  }
  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "el token no es válido" });
  }
};

exports.postLogin = async (req, res) => {
  const { rows } = await pool.query(
    "select * from public.usuarios where email=$1 limit 1",
    [req.body.mail]
  );
  if (!rows[0]) {
    return res.status(400).json({ error: "email no válida" });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    rows[0].password
  );
  if (!validPassword) {
    return res.status(400).json({ error: "contraseña no válida" });
  }

  const token = jwt.sign(
    {
      name: rows[0].nombre,
    },
    TOKEN_SECRET
  );
  return res.json({ token: token });
};

exports.TOKEN_SECRET = TOKEN_SECRET;
