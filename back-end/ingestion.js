import mongoose from "mongoose";
import products from "../data/MOCK_DATA.json" with { type: "json" };
const uri = "mongodb://localhost:27017/myDatabase";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  createdAt: Date,
});

const product = mongoose.model("Product", ProductSchema);

mongoose
  .connect(uri)
  .then(async () => {
    const existing = await product.countDocuments();
    if (existing > 0) {
      console.log("Data already exists, skipping insertion");
      mongoose.connection.close();
      return;
    }

    await product.insertMany(products);
    console.log("Insertion successful");
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));

// console.log('The code has been executed')

export default mongoose.model("Product", ProductSchema);
