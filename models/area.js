const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
  nombre: { type: String, required: true },
});

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
