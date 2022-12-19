const express = require('express');
const {conectDB} =  require('./db');
const User = require('./models/users');

conectDB();
const app = express();
const port = process.env.PORT || 3000;


app.get('/api/tickets', async (req,res)=>{
  const users = await  User.find();
  res.json(users);
})








app.use(express.static('public'));

app.listen(port,()=>{
  console.log("escuchando el puerto...");
});
