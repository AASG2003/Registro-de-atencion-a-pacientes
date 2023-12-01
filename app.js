// const {frutas, dinero} = require('./frutas');
// frutas.forEach(item=>{
//     console.log(item)
// })
// const cowsay = require('cowsay');
// console.log(cowsay.say({
//     text:"I'm a mooodule",
//     e : "oO",
//     T:"U "
// }))
// console.log(dinero);
// const http = require('http');
// const server = http.createServer((req, res) => {
//     res.end("estoy respondiendo a tu solicitud")
// })

// const puerto = 3000;
// server.listen(puerto, ()=>{
//     console.log('escuchando solicitudes')
// });

const express = require("express");
const app = express();
const bodyParse = require('body-parser');
const port = 3000;

const mongoose = require('mongoose');

app.use(bodyParse.urlencoded({extended:false}))
app.use(bodyParse.json())

const user ='pruebaVet';
const password='pruebaVet1234';
const database='veterinaria';
const uri=`mongodb+srv://${user}:${password}@cluster0.wivpbj3.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(uri)
.then(()=>console.log('Base de datos conectado'))
.catch(e => console.log(e));

//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');


app.use(express.static(__dirname + "/public"))

//rutas web
app.use('/', require('./router/RutasWeb'));
app.use('/mascotas', require('./router/Mascotas'));
app.use('/pacientes', require('./router/Paciente'));
app.use('/medicos', require('./router/Medico'));
app.use('/areas',require('./router/Area'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use((req, res, next) =>{  
  res.status(404).render("404");
});
