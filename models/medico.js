const mongoose = require('mongoose');
const Schema = mongoose.Schema;// Importar el modelo de Consulta

const medicoSchema = new Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  fecha_de_nacimiento: { type: Date, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  area:{type: String}
});

const Medico = mongoose.model('Medico', medicoSchema);

module.exports = Medico;
