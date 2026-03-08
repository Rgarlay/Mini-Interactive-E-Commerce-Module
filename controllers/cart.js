import { Carts, Products } from '../models/models.js';

const incrementNumber =  async (req, res) => {
  try {
    const { id, price, count } = req.body;

    await Carts.findOneAndUpdate(
      { ProductId: id },
      { ProductId: id, Quantity: parseInt(count), TotalPrice: parseFloat(price) * parseInt(count) },
      { upsert: true }
    );

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error(err);  // see full error in terminal
    res.status(500).json({ error: err.message });
  }
};

const decrementNumber = async (req, res) => {
  const { id, price, count } = req.body;

  if (parseInt(count) === 0) {
    await Carts.findOneAndDelete({ ProductId: id });
    return res.json({ message: "Item removed from cart" });
  }

  await Carts.findOneAndUpdate(
    { ProductId: id },
    { Quantity: parseInt(count), TotalPrice: parseFloat(price) * parseInt(count) },
    { upsert: true }
  );
  res.json({ message: "Cart updated" });
}

const GetTotalQuantity = async (req,res) => {
  try{
    const TotalQuantity = await Carts.find({});
    
    let TotalElements = 0
    TotalQuantity.forEach((key) => {
      TotalElements += key["Quantity"]
    });
    
    res.json({'Quantity': TotalElements});
    }

    catch (err) {
      console.log(err);
    }}


const GetEachCount = async (req,res) => {
  try{
  const count = await Carts.find({}, 'ProductId Quantity');

  res.json({'EachQuantity': count});
  }
  catch (err) {
    console.log(err);
  }}



export {incrementNumber,decrementNumber, GetTotalQuantity, GetEachCount};