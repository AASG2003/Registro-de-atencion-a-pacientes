const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultaSchema = new Schema({
  fecha: { type: Date, required: true },
  motivo: { type: String, required: true },
  doctor: {type: String, required: true},
  diagnostico: { type: String, required: true }
});

const Consulta = mongoose.model('Consulta', consultaSchema);

module.exports = Consulta;
