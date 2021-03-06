const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../modles/todo');
var {User} = require('./../../modles/user');
const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [{
  _id: userOneId,
  email: 'philip@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jan@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const todos = [{
  _id:  new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id:  new ObjectID(),
  text: 'sec test todo',
  comleted: true,
  comletedAt: 333,
  _creator: userTwoId
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos,(err, docs) => {
      if(err){
        return done(err);
      }
    })
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos , populateUsers , users};
