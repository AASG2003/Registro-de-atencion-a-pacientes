const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Consulta = require('./consulta'); // Importar el modelo de Consulta

const pacienteSchema = new Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  fecha_de_nacimiento: { type: Date, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  consultas: [Consulta.schema] // Utilizar el esquema de consulta
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
