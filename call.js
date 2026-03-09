import express from 'express';
import {GetAllCategories, GetAllData,GetSelectedCategories,
    GetProductByKeyword,GetProductbyId , AddProductToDb} from '../controllers/Product.js'
import {DeleteItem, GetTotalQuantity, incrementNumber,decrementNumber, GetEachCount } from '../controllers/cart.js'
import {ConnectionToDb} from '../connection.js';


const uri = 'mongodb://localhost:27017/myDatabase';
ConnectionToDb(uri);



const app = express();
app.use(express.json());

app.use(express.static('../views'));

app.get('/api/products', GetAllData);

app.post('/api/products', AddProductToDb);

app.get('/api/products/search', GetProductByKeyword);

app.get('/api/products/:id', GetProductbyId);

app.post('/cart/increase', incrementNumber);            //Subsitution for /api/cart poitst

app.post('/cart/decrease', decrementNumber);

app.get('/cart/gettotal', GetTotalQuantity);            // Subsitution for /api/cart get

app.get('/api/quantity',GetEachCount);

app.delete('/api/cart/:id', DeleteItem);

app.get('/api/category',GetAllCategories);

app.post('/api/selectedcategory',GetSelectedCategories);

app.listen(3000, () => console.log('Server running on http://localhost:3000/home.html'));







