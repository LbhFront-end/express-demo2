const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'Talk';


init();
function init(collectionName, json, args = null) {
  if (collectionName) {
    connectDB((err, client) => {
      if (err) throw Error(err);
      client.db(dbName).collection(collectionName).createIndex(json, args, (err, result) => {
        if(err) throw Error(err);
        console.log('建立索引成功')
      });
    })
  }
}


const connectDB = (callback) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      callback(err, null);
      return client.close();
    }
    callback(err, client)
  });
}

exports.insertOne = (collectionName, json, callback) => {
  connectDB((err, client) => {
    const col = client.db(dbName).collection(collectionName);
    col.insertOne(json, (err, result) => {
      callback(err, result);
      client.close();
    })
  })
}

exports.find = (collectionName, json = {}, args, callback) => {
  const { pageAmount = 0, page = 0, sort = {} } = args;
  const skipNumber = pageAmount * page;
  const limit = pageAmount;
  const result = [];
  connectDB((err, client) => {
    const cursor = client.db(dbName).collection(collectionName).find(json).limit(limit).skip(skipNumber).sort(sort);
    cursor.each((err, doc) => {
      if (err) {
        callback(err, null);
        return client.close();
      }
      if (doc !== null) {
        result.push(doc)
      } else {
        callback(err, result);
        client.close();
      }
    })
  })
}

exports.deleteMany = (collectionName, json, callback) => {
  connectDB((err, client) => {
    const col = client.db(dbName).collection(collectionName);
    col.deleteMany(json, (err, result) => {
      if (err) {
        callback(err, null)
        return client.close();
      }
      callback(err, result);
      client.close();
    });
  })
}

exports.updateMany = (collectionName, json1, json2, callback) => {
  connectDB((err, client) => {
    const col = client.db(dbName).collection(collectionName);
    col.updateMany(json1, json2, (err, result) => {
      if (err) {
        callback(err, null)
        return client.close();
      }
      callback(err, result);
      client.close();
    })
  })
}

exports.getAllCount = (collectionName, callback) => {
  connectDB((err, client) => {
    const col = client.db(dbName).collection(collectionName);
    col.find({}).count().then((count) => {
      callback(err, count);
      client.close();
    })
  })
}