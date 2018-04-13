// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
  if(err){
    return console.log('Unable to connect to MDB server');
  }
  console.log('connect to mongodb server');
  const db = client.db('TodoApp')

   // db.collection('Todos').findOneAndUpdate({
   //   _id: new ObjectID('5ad098f82b334f17483d19e7')
   // }, {
   //   $set: {
   //     completed: false
   //   }
   // }, {
   //   returnOriginal: false
   // }).then((res) => {
   //   console.log(res);
   // })
   db.collection('Users').findOneAndUpdate({
     name: "Dr.Mend\'lson"
   }, {
     $set: {name: "Philip"},
     $inc: {age: -1}
   }, {
     returnOriginal: false
   }).then((res) => {
     console.log(res);
   }, (err) => {
     console.log(err);
   })

  // client.close();
});
