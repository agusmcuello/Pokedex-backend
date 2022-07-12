const express = require("express");
const app = express();
const pokemon = require("./routes/pokemon");
const tipo = require("./routes/tipo");
const descripcion = require("./routes/descripcion");
const estadisticas = require("./routes/estadisticas");
const movimientos = require("./routes/movimientos");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/", pokemon);
app.use("/", tipo);
app.use("/", descripcion);
app.use("/", estadisticas);
app.use("/", movimientos);

app.listen(1234, () =>
  console.log("Server listening in http://localhost:1234")
);
