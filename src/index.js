const express = require('express');
const {conectDB} =  require('./db');


conectDB();
const app = express();
const port = process.env.PORT || 3000;


app.get('/api/tickets', (req,res)=>{
  res.json([
    {
      name:"Antonio",
      lastname:"suarez"
    },
    {
      name:"Marcos",
      lastname:"Rincon"
    }
  ])
})








app.use(express.static('public'));

app.listen(port,()=>{
  console.log("escuchando el puerto...");
});
