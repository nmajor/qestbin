import { MongoClient } from 'mongodb';
import mongoCon from '../mongoCon';

export function find(collection, query) {
  const db = mongoCon.getDb();
  return new Promise((resolve, reject) => {
    db.collection(collection).find(query || {}).toArray((err, res) => {
      if (err) reject(err);
      return resolve(res);
    });
  });
}

export function findOne(collection, query) {
  const db = mongoCon.getDb();
  return new Promise((resolve, reject) => {
    db.collection(collection).findOne(query || {})
    .then((res, err) => {
      if (err) reject(err);
      return resolve(res);
    });
  });
}

export function insertOne(collection, props) {
  const db = mongoCon.getDb();
  return db.collection(collection).insertOne(props)
  .then((res, err) => {
    if (err) return Promise.reject(err);
    return findOne(collection, res.insertedId);;
  });
}

export function updateOne(collection, query, update) {
  const db = mongoCon.getDb();
  return db.collection(collection).updateOne(query, update)
  .then((res, err) => {
    if (err) return reject(err);
    return findOne(collection, query);
  });
}

export function insertOrUpdate(collection, query, props) {
  return findOne(collection, query)
  .then((doc) => {
    if (doc) {
      return updateOne(collection, query, { $set: props })
    }

    return insertOne(collection, { ...props })
  });
}

export function remove(collection, query) {
  const db = mongoCon.getDb();
  return findOne(collection, query)
  .then((doc) => {
    return new Promise((resolve, reject) => {
      db.collection(collection).deleteOne(query)
      .then((res, err) => {
        if (err) reject(err);
        return resolve(doc);
      });
    });
  });
}
