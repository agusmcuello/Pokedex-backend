const express = require("express");
const cors = require("cors");
const pokemon = require("./routes/pokemon");
const tipo = require("./routes/tipo");
const descripcion = require("./routes/descripcion");
const estadisticas = require("./routes/estadisticas");
const movimientos = require("./routes/movimientos");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/", pokemon);
app.use("/", tipo);
app.use("/", descripcion);
app.use("/", estadisticas);
app.use("/", movimientos);

app.listen(8080, () =>
  console.log("Server listening in http://localhost:8080")
);
