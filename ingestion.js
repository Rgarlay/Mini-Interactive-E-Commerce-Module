import product from "../data/MOCK_DATA.json" with { type: "json" };
import Products from './models/models.js'


const uri = "mongodb://localhost:27017/myDatabase";

mongoose.connect(uri)
  .then(async ()  => {
    console.log('MongoDB Connected')
    const existing = await Products.countDocuments();
    if (existing > 0) {
      console.log("Data already exists, skipping insertion");
      mongoose.connection.close();
      return;
    }
    await Products.insertMany(product);
    console.log("Insertion successful");
    mongoose.connection.close();
    })
.catch((err) => console.error(err));




// console.log('The code has been executed')

