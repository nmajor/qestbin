import { MongoClient } from 'mongodb';

const mongoUrl = process.env.MONGO_URL.replace('==', encodeURIComponent('=='));
let _db;

export default {
  connectToServer: (callback) => {
    console.log('Connecting to MongoDB...')
    MongoClient.connect(mongoUrl, {}, (err, client, cb) => {
      _db = client.db('kazendi');;
      return callback( err );
    });
  },

  getDb: function() {
    return _db;
  }
};
