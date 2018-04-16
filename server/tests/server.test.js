
const expect = require('expect');
const reques = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../modles/todo')
const {User} = require('./../modles/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    reques(app)
    .patch(`/todos/${hexId}`)
    .send({
      text: "new text",
      completed: true})
    .expect(200)
    .expect((res) => {
      var todo = res.body.todo;
      expect(todo.text).toBe("new text");
      expect(todo.completed).toBe(true);
      expect(typeof(todo.completedAt)).toBe('number');
    })
    .end(done)
  });

  it('should clear comletedAt when todo is not comleted', (done) => {
    var hexId = todos[1]._id.toHexString();

    reques(app)
    .patch(`/todos/${hexId}`)
    .send({
      text: "new text",
      completed: false})
    .expect(200)
    .expect((res) => {
      var todo = res.body.todo;
      expect(todo.text).toBe("new text");
      expect(todo.completed).toBe(false);
      expect(todo.completedAt).toBeFalsy();
    })
    .end(done)
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    reques(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done)
  })

  it('should return 404 if not authenticated', (done) => {
    reques(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'examle@gmail.co'
    var password ="123321"
    reques(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err)
      }
      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password)
        done()
      }).catch((e) => done(e))
    })
  });

  it('should return valid err if req invalid', (done) => {
    reques(app)
    .post("/users")
    .send({email: "lolJustNOTaEmail", password:"12345"})
    .expect(400)
    .end(done)
  });

  it('should not create user if email un use', (done) => {
    reques(app)
    .post("/users")
    .send({email: users[0].email, password:"123456"})
    .expect(400)
    .end(done)
  });
})

describe('POST user/login', () =>{
  it('should login user and return auth token', (done) => {
    reques(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy()
    })
    .end((err, res) => {
      if(err) {
        return done(err)
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        })
        done();
      }).catch((e) => done(e))
    })
  })
  it('should reject invalid login', (done) => {
    reques(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: "users[1].password"
    })
    .expect(404)
    .expect((res) => {
      expect(res.headers['x-auth']).not.toBeTruthy()
    })
    .end((err, res) => {
      if(err) {
        return done(err)
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0)
        done();
      }).catch((e) => done(e))
    })
  })
})
