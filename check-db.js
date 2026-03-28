const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wenjuan');
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`Collection ${col.name} count: ${count}`);
      if (count > 0) {
        const docs = await mongoose.connection.db.collection(col.name).find().limit(1).toArray();
        console.log(`Sample doc from ${col.name}:`, JSON.stringify(docs[0], null, 2));
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDB();
