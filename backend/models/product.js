const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  active: { type: Boolean, default: true },
});
module.exports = mongoose.model('Product', ProductSchema);
