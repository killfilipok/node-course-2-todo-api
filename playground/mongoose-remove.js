const {ObjectID} = require('mongodb');

const {User} = require('./../server/modles/user');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/modles/todo');

// Todo.remove({}).then((res) => {
//   console.log(res);
// })

// Todo.findByIdAndRemove('5ad264bbe36c4b8d63ef3619').then((todo) => {
//   console.log(todo);
// })
