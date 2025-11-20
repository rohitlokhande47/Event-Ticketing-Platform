const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  mongoose.connection.collection('tickets').find({}).limit(5).toArray((err, docs) => {
    console.log('Sample tickets:', JSON.stringify(docs, null, 2));
    mongoose.connection.close();
  });
});
