const expect = require('expect');
const reques = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../modles/todo')

const todos = [{
  _id:  new ObjectID(),
  text: 'First test todo'
}, {
  _id:  new ObjectID(),
  text: 'sec test todo'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos,(err, docs) => {
      if(err){
        return done(err);
      }
    })
  }).then(() => done());
});

describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    reques(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err)
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    })
  })

  it('should not create todo with invalid body data', (done) => {
    reques(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err)
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(err));
    })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    reques(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  })
})

describe('GET/ todos/:id', () => {
  it('should return todo doc', (done) => {
    reques(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done)
  })

  it('should return 404 if todo not found', (done) => {
    reques(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  })

  it('should return 404 for non object ids', (done) => {
    reques(app)
    .get('/todos/123')
    .expect(404)
    .end(done)
  })
})

describe('DELETE /todos/:id',(done) => {
  it('should remove todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    reques(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res)=> {
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch((e) => done(e));
    })
  })
  it('should return 404 if todo not found', (done) => {
    reques(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  })
  it('should return 404 for non object ids', (done) => {
    reques(app)
    .delete(`/todos/123`)
    .expect(404)
    .end(done)
  })
})
