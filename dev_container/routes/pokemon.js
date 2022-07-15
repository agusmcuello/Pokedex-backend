const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  getPokemon,
  getAllPokemon,
  postNewPokemon,
  updatePokemon,
  deletePokemon,
  verifyToken,
  TOKEN_SECRET,
} = require("../controllers/pokemon");

const usuarios = [
  {
    name: "Juan",
    mail: "juan@gmail.com",
    password: "$2b$10$kKO2X7Hz419rDpxU7i5fH.I5BAWfxTvMjFPzU7tzGo3xibGZeX6OK",
  },
];

router.get("/pokemon/:nombrePokemon", getPokemon);
router.get("/pokemon", getAllPokemon);
router.post("/agregarPokemon", verifyToken, postNewPokemon);
router.put("/modificarPokemon/:nombre", verifyToken, updatePokemon);
router.delete("/borrarPokemon/:nombre", verifyToken, deletePokemon);
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const newUser = {
    name: req.body.name,
    mail: req.body.mail,
    password: password,
  };

  usuarios.push(newUser);

  res.json({ success: true, newUser, usuarios, salt });
});

router.post("/login", async (req, res) => {
  const user = usuarios.find((u) => u.mail === req.body.mail);
  if (!user) {
    return res.status(400).json({ error: "usuario no encontrado" });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "contraseña no válida" });
  }

  const token = jwt.sign(
    {
      name: user.name,
      id: user.id,
    },
    TOKEN_SECRET
  );
  res.json({ error: null, data: "login exitoso", token });
});

module.exports = router;
