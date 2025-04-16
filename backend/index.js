const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'backend/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI);

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');

// Middleware
const isAdmin = (req, res, next) => {
  const telegramUser = req.body.telegramUser || req.query;
  if (!telegramUser || telegramUser.id != process.env.ADMIN_ID) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// Routes
app.get('/products', async (req, res) => {
  const products = await Product.find({ active: true });
  res.json(products);
});

app.post('/orders', upload.single('proofImage'), async (req, res) => {
  const { items, telegramUser, paymentMethod } = JSON.parse(req.body.data);
  const proofImage = req.file ? `/uploads/${req.file.filename}` : '';
  const order = await Order.create({
    userId: telegramUser.id,
    username: telegramUser.username,
    items,
    paymentMethod,
    proofImage,
    status: 'pending'
  });

  const axios = require('axios');
  await axios.post(`${process.env.BOT_URL}/notify`, order);

  res.json({ success: true });
});

app.get('/admin/orders', isAdmin, async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

app.post('/admin/products', isAdmin, upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const product = await Product.create({ name, price, image });
  res.json(product);
});

app.put('/admin/products/:id', isAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
