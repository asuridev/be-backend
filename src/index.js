const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


app.get('/api/tickets', (req,res)=>{
  res.send('Helo World')
})


app.use(express.static('public'));

app.listen(port,()=>{
  console.log("escuchando el puerto...");
});
