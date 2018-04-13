// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
  if(err){
    return console.log('Unable to connect to MDB server');
  }
  console.log('connect to mongodb server');
  const db = client.db('TodoApp')

  // db.collection('Todos').find({
  //   _id: new ObjectID("5ad098f82b334f17483d19e7")
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log("error: ", err);
  // });
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log("error: ", err);
  // });
  db.collection('Users').find({
    name: "Philip"
  }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }), (err) => {
    console.log('Error ', err);
  }
  // client.close();
});
