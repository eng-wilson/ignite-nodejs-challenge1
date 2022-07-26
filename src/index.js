const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(404).json({ error: 'User not found.'})
  }

  request.username = username

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userExists = users.some(user => user.username === username)

  if (userExists) {
    return response.status(400).json({error: 'User already exists.'})
  }

  users.push({
    name,
    username,
    todos: []
  })

  return response.status(200).json({ name, username })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  const user = users.find(user => user.username === username)

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request;

  const user = users.find(user => user.username === username)

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  return response.status(200).json(user.todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find(user => user.username === username)
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist."})
  }

  todo.title = title,
  todo.deadline = deadline

  return response.status(200).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request;

  const user = users.find(user => user.username === username)
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exist."})
  }

  todo.done = true;

  return response.status(200).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;