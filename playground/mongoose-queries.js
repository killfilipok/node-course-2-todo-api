const {ObjectID} = require('mongodb');

const {User} = require('./../server/modles/user');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/modles/todo');

// var id = "5ad2239fda54e43778313634111";
//
// if(!ObjectID.isValid(id)){
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos', todo);
// })

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e) => console.log(e));

var id = '5ad0d4e13f72491dc88298f1'

User.findById(id).then((user) => {
  if(!user){
    console.log('user not found');
  }
  console.log(user);
}).catch((e) => console.log(e));
