import express from 'express';
import mongoose from 'mongoose';
import Product from './schema.js';

const app = express();
const uri = 'mongodb://localhost:27017/myDatabase';

app.use(express.json());

mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.get('/api/products', async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ← moved to bottom
app.use(express.static('../front-end'));

app.listen(3000, () => console.log('Server running on http://localhost:3000/home.html'));