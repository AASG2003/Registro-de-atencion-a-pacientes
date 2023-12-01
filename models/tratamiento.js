const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tratamientoSchema = new Schema({
   nombre : String,
   descripcion : String 
})

const Mascota = mongoose.model('Mascota', mascotaSchema);

module.exports = Mascota;