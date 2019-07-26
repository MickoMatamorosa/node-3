const express = require('express');
const massive = require('massive');
const users = require('./controllers/users');
const posts = require('./controllers/posts');
const comments = require('./controllers/comments');

massive({
    host: 'localhost',
    port: 5432,
    database: 'node3',
    user: 'postgres',
    password: 'node3db',
}).then(db => {
    const app = express();
  
    app.set('db', db);
  
    app.use(express.json());

    // Users
    app.post('/api/users', users.create);
    app.get('/api/users', users.list);
    app.get('/api/users/:id', users.getById);
    app.get('/api/users/:id/profile', users.getProfile);

    // Posts
    app.post('/api/posts', posts.create);
    app.get('/api/posts/:postId', posts.getPost)
    app.patch('/api/post/:postId', posts.editPost);

    // Comments
    app.post('/api/comments', comments.create);
    app.patch('/api/comment/:cmtId', comments.editComment);
  
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
});