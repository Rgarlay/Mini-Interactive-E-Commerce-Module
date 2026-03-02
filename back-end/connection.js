import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/myDatabase';

mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));