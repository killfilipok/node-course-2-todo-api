// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
  if(err){
    return console.log('Unable to connect to MDB server');
  }
  console.log('connect to mongodb server');
  const db = client.db('TodoApp')

  //deletMany
  // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
  //   console.log(result);
  // }), (err) => {
  //   console.log(err);
  // };
  //deleteOne
  // db.collection('Todos').deleteOne({text : "Eat lunch"}).then((result) => {
  //   console.log(result);
  // })
  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
  //   console.log(res);
  // });
  // db.collection('Users').deleteMany({
  //   name: "Philip"
  // }).then((res) => {
  //   console.log(res);
  // }, (err) => {
  //   console.log(err);
  // })
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5ad09a772ab0fd04680a40a7')
  }).then((res) => {
    console.log(res);
  }, (err) => {
    console.log(err);
  });
  // client.close();
});
