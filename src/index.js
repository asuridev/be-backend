const express = require("express");
const { conectDB } = require("./db");
const { Ticket } = require("./models/tickets"); // iportando modelo

// settings
conectDB();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
process.env.TZ = "UTC-5"

// routes
app.get("/api/tickets", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

// end-point para agregar tickets
app.post("/api/tickets", (req, res) => {
  const data = req.body;
  data.date = new Date( (new Date().getTime()) - (new Date().getTimezoneOffset())*60000);
  //data.date = new Date();
  const ticket = new Ticket(data);
  ticket.save((err) => {
    if (err) {
      res.status(400).send("formato Incorrecto");
    } else {
      console.log("guardando...");
      res.json(req.body);
    }
  });
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log("escuchando el puerto...");
});
