const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  database: "pokemon",
  password: "lagatacamila",
  port:9090,
});
const bcrypt = require("bcrypt");

exports.getPokemon = async (req, res) => {
  const { nombrePokemon } = req.params;

  const { rows:listaPokemon } = await pool.query(
    "select * from public.pokemon where pokemon.deleted = false order by pokemon.number"
  );
  const { rows } = await pool.query(
    `select *, pokemon.id as id from public.pokemon join public.stats on stats.pokemon_id = pokemon.id where pokemon.deleted = false and lower(pokemon.name) = $1`,[nombrePokemon.toLowerCase()]
  );
  const pokemon = rows[0];
  const pokemonIndex = listaPokemon.findIndex(
    (pokemon) => pokemon.name.toLowerCase() === nombrePokemon.toLowerCase()
  );
  const { rows:rowsPrev } = await pool.query(
    `select name from public.pokemon where name=$1`, [listaPokemon[pokemonIndex-1]?.name]
  );
  const { rows:rowsNext } = await pool.query(
    `select name from public.pokemon where name= $1`, [listaPokemon[pokemonIndex+1]?.name]
  );
  
  res.send({ ...pokemon, next: rowsNext[0]?rowsNext[0].name:null, prev: rowsPrev[0]?rowsPrev[0].name:null }); 
};
exports.getAllPokemon = async (req, res) => {

  const { rows } = await pool.query(
    "select * from public.pokemon where pokemon.deleted = false"
  );
  // const { tipo, atk } = req.query;
  // if (tipo) {
  //   const tipos = tipo.split(",");
  //   tipos.forEach((t) => {
  //     listaFiltrada = listaFiltrada.filter(
  //       (p) =>
  //         p.tipo.toLowerCase() === t.toLowerCase() ||
  //         p.tipoDos?.toLowerCase() === t.toLowerCase()
  //     );
  //   });
  // }
  // if (atk) {
  //   listaFiltrada = listaFiltrada.filter(
  //     (p) => parseInt(p.estadisticas.atk) > parseInt(atk)
  //   );
  // }

  res.send(rows);
};

exports.postNewPokemon = async (req, res) => {
  const newPokemon = {
    name: req.body.name,
    color:req.body.color,
    type: req.body.type,
    type_two: req.body.type_two,
    type_two_color: req.body.type_two_color,
    weight: req.body.weight,
    height:req.body.height,
    first_ability:req.body.first_ability,
    second_ability:req.body.second_ability,
    description: req.body.description,
    number:req.body.number,
    icon: req.body.icon,
  };

  try {
   const {rows:respuesta} = await pool.query(
      "INSERT INTO public.pokemon (name,color,type,type_two,type_two_color,weight,height,first_ability,second_ability,description,number,icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning id",
      [newPokemon.name, newPokemon.color, newPokemon.type, newPokemon.type_two, newPokemon.type_two_color, newPokemon.weight, newPokemon.height, newPokemon.first_ability,newPokemon.second_ability,newPokemon.description,newPokemon.number, newPokemon.icon]
    );

    const pokemonStats={
      id: newPokemon.number,
      hp: req.body.hp,
      atk: req.body.atk,
      def:req.body.def,
      satk:req.body.satk,
      sdef:req.body.sdef,
      spd:req.body.spd,
      pokemon_id:respuesta[0].id
    }
    await pool.query(
      "INSERT INTO public.stats (id, hp, atk, def, satk, sdef, spd, pokemon_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",[newPokemon.number,pokemonStats.hp,pokemonStats.atk,pokemonStats.def,pokemonStats.satk,pokemonStats.sdef,pokemonStats.spd, respuesta[0].id]
    )

  
    res.json({ success: true, newPokemon, pokemonStats });
  } catch (error) {
    res.json({ error: error });
  }
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

exports.deletePokemon = async (req, res) => {
  const { nombre } = req.params;

  const {rows} = await pool.query(
    "UPDATE public.pokemon SET deleted=true WHERE pokemon.name = $1",[nombre]
  )
  const {rows:listaNueva} = await pool.query(
    "select * from public.pokemon where public.pokemon.deleted=false"
  )
    res.send(listaNueva);
  };

const TOKEN_SECRET = "UnaClaveParaFirmarElToken";

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "acceso denegado" });
  }
  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "el token no es válido" });
  }
};

exports.postLogin = async (req, res) => {
  const { rows } = await pool.query(
    "select * from public.usuarios where email=$1 limit 1",
    [req.body.mail]
  );
  if (!rows[0]) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    rows[0].password
  );  
  if (!validPassword) {
    return res.status(400).json({ error: "Incorrect password" });
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
