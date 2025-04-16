const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const app = express();
app.use(bodyParser.json());

app.post('/notify', async (req, res) => {
  const order = req.body;
  const msg = `🛒 Pesanan Baru dari @${order.username}
Total item: ${order.items.length}

➡️ [Lihat Admin Panel](${process.env.ADMIN_URL})`;
  await bot.sendMessage(process.env.ADMIN_ID, msg, { parse_mode: 'Markdown' });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Bot webhook running on ${PORT}`));
