import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [tgUser, setTgUser] = useState(null);
  const [proof, setProof] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    setTgUser(tg.initDataUnsafe.user);

    axios.get('/products').then(res => setProducts(res.data));
  }, []);

  const checkout = async () => {
    const form = new FormData();
    form.append('data', JSON.stringify({
      items: cart,
      telegramUser: tgUser,
      paymentMethod: 'manual'
    }));
    if (proof) form.append('proofImage', proof);

    await axios.post('/orders', form);
    alert('Pesanan dibuat!');
    setCart([]);
    setProof(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Produk Kami</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="border p-2 rounded">
            <img src={p.image} className="w-full h-32 object-cover" />
            <div>{p.name}</div>
            <div>Rp {p.price}</div>
            <button onClick={() => setCart([...cart, { ...p, qty: 1 }])} className="bg-blue-500 text-white px-2 py-1 rounded mt-2">Tambah</button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm mb-1">Upload Bukti Transfer:</label>
        <input type="file" onChange={(e) => setProof(e.target.files[0])} />
      </div>
      <button onClick={checkout} className="bg-green-600 text-white mt-4 px-4 py-2 rounded">Checkout</button>
    </div>
  );
}

export default App;
