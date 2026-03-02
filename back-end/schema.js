import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  createdAt: Date
});

export default mongoose.model('Product', productSchema);