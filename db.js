const { MongoClient } = require("mongodb");
let database = null;

const URI =
  //process.env.MONGO_URL || "mongodb+srv://sowmya:iNNrxOhVfEdvsUaI@happinewsls.cnw2n.mongodb.net/happi-new-sls?replicaSet=atlas-11ilgn-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1";
  // process.env.MONGO_URL || "mongodb+srv://happi-iipl:BE7i69APVFzKRnwq@happiprod.ve3rwzm.mongodb.net/?retryWrites=true&w=majority";
  process.env.MONGO_URL || "mongodb://happimain:tUDuD9okePhlyl%2B@127.0.0.1:27017/?authMechanism=DEFAULT&authSource=happi-new-sls";

exports.connect = async function () {
  if (database) {
    return database;
  }
  var client = new MongoClient(URI);

  await client.connect();
  //happi-qa
  database = client.db(process.env.MONGO_DB || "happi-new-sls");
  // const collection = database.collection(collectionName);

  return database;
};
``
