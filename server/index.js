require('dotenv').config();
const express = require('express'),
      massive = require('massive'),
      session = require('express-session'),
      userCtrl = require('./controllers/user'),
      postCtrl = require('./controllers/posts'),
      { SESSION_SECRET, CONNECTION_STRING, SERVER_PORT } = process.env;


const app = express();

app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14
  }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  }).then(db => {
    app.set('db', db);
    console.log('db connected');
  });

//Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(SERVER_PORT, _ => console.log(`running on ${SERVER_PORT}`));