const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  paymentMethod: String,
  proofImage: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', OrderSchema);
