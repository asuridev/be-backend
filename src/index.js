const express = require("express");
const { conectDB } = require("./db");
const { Ticket } = require("./models/tickets"); // importando modelo
const {Fly} = require("./models/flights"); // importando modelo
const {User} = require("./models/users"); // importando modelo
const {v4:uuidv4} =  require('uuid');

// settings
conectDB();
const app = express();
app.use(express.json());
app.use(express.static("public"));
const port = process.env.PORT || 3000;
process.env.TZ = "America/Bogota";


// routes
app.get("/api/tickets", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});


// end-point para consultar vuelos
app.get("/api/fakeapi/flights", async (req, res) => {
  const flights = await Fly.find();
  res.json(flights);
});

// end-point para agregar tickets
app.post("/api/tickets", (req, res) => {
  const data = req.body;
  data.date = new Date( (new Date().getTime()) - (new Date().getTimezoneOffset())*60000);
  data.status = "no-paid";
  const ticketId = uuidv4();
  data.ticketId = ticketId;
  const ticket = new Ticket(data);
  ticket.save((err) => {
    if (err) {
      res.status(400).send("formato Incorrecto");
    } else {
      console.log("guardando...");
      res.json({ticketId});
    }
  });
});

// end-point para solicitar resumen de pago.
app.get("/api/tickets/:ticketId", async (req, res) => {
  const ticketId = req.params.ticketId;
  const ticket = await Ticket.findOne({ticketId});
  if(ticket){
    // se encontro ticket
    const infoFlayIda = await Fly.findOne({flyId:ticket.flights[0]});
    const precioIda = infoFlayIda.price;
    
    let precioVuelta = 0;
    if(ticket.rt){
      const infoFlayVuelta = await Fly.findOne({flyId:ticket.flights[1]});
      precioVuelta = infoFlayVuelta.price;
    }
    const price = precioIda + precioVuelta;
    const infoPassenger = [];
    let value = 0;
    for(let item of ticket.passengers){
      let percentage = 0;
      if(item.size === 'baby'){
        percentage = 90;
      }else{
        //reglas de descuento
        const userFly = await User.findOne({id:item.id});
        //validando si es usuario frecuente
        if(userFly){
          percentage += 5;
          //validando si voló diez veces en el año;
          if(userFly.tickets.length > 9){
            percentage += 5;
          }
        }
        if(item.age > 65){
          percentage += 5;
        }
      }
      const total = (price - (price*percentage/100));
      value += total;
      infoPassenger.push({...item,price,percentage,total})
    }
    ticket.value = value;
    ticket.passengers = [...infoPassenger];
    res.json(ticket);
  }else{
    res.status(400).json("el ticketId no es valido");
  }
});

//end-point para pagar
app.patch("/api/tickets/:ticketId", async (req,res) =>{
  const infoPay = req.body;
  const ticketId = req.params.ticketId;
  const ticket = await Ticket.findOne({ticketId});
  if(ticket && ticket.status === 'no-paid'){
    // se encontro ticket
    const infoFlayIda = await Fly.findOne({flyId:ticket.flights[0]});
    const precioIda = infoFlayIda.price;
    
    let precioVuelta = 0;
    if(ticket.rt){
      const infoFlayVuelta = await Fly.findOne({flyId:ticket.flights[1]});
      precioVuelta = infoFlayVuelta.price;
    }
    const price = precioIda + precioVuelta;
    const infoPassenger = [];
    let value = 0;
    for(let item of ticket.passengers){
      let percentage = 0;
      if(item.size === 'baby'){
        percentage = 90;
      }else{
        //reglas de descuento
        const userFly = await User.findOne({id:item.id});
        //validando si es usuario frecuente
        if(userFly){
          percentage += 5;
          //validando si voló diez veces en el año;
          if(userFly.tickets.length > 9){
            percentage += 5;
          }
        }
        if(item.age > 65){
          percentage += 5;
        }
      }
      const total = (price - (price*percentage/100));
      value += total;
      infoPassenger.push({...item,price,percentage,total})
    }
    ticket.value = value;
    ticket.passengers = [...infoPassenger];
    let isPaid = false;
    // proceso de pago.
       if(infoPay.card === 12345){
        isPaid = true;
       }
    //proceso de pago
    if(isPaid){
      ticket.status = "paid";
      const response = await Ticket.updateOne({ticketId},ticket);
      //-----
      for(let item of ticket.passengers){
        const infoUser = await User.findOne({id:item.id});
        if(infoUser){
          //update de los vuelos del usuario
          infoUser.miles =  infoUser.miles + 100;
          infoUser.tickets = [...infoUser.tickets , ticketId];
          const resp = await User.updateOne({id:item.id},infoUser);
        }else{
          const dataUser = {
            id:item.id,
            miles:100,
            tickets:[ticketId]
          }
          const user = new User(dataUser);
          user.save((err) => {
            if (err) {
              res.status(400).send("formato Incorrecto");
            } else {
              console.log("usuario guardado..");
            }
          });
        }
      }

      //-----
      res.json("pago exitoso");
    }else{
      res.status(400).json("el valor ingresado de la tarjeta de nos valido");
    }
  }else{
    res.status(400).json("el ticketId no es valido");
  }
})





app.listen(port, () => {
  console.log("escuchando el puerto...");
});
