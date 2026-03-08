import { Products } from '../models/models.js';



const GetAllData = async (req,res) => {
  try{
    const products = await Products.find({});
    res.json(products);
  } 
    catch(err) {res.status(500).json({error: err.message});
  }
};

const GetProductByKeyword = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const reply = await Products.find({
      name: { $regex: query, $options: 'i' }
    });
    res.json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const GetProductbyId = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const AddProductToDb = async (req, res) => {
  try {
    const product = new Products(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export { GetAllData, GetProductbyId, AddProductToDb, GetProductByKeyword };
