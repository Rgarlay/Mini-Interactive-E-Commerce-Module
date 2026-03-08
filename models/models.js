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


const CartSchema = new mongoose.Schema({
  ProductId: String,
  Quantity: Number,
  TotalPrice: Number
});

const Products = mongoose.model('products', productSchema);
const Carts = mongoose.model('carts', CartSchema, );

export { Products,Carts};

