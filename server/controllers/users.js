const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const secret = require('../../secret.js');

function create(req, res) {
  const db = req.app.get('db');

  const { email, password } = req.body;

  argon2
  .hash(password)
  .then(hash => {
    return db.users.insert({
            email,
            password: hash,
        },
        {
            fields: ['id', 'email']
        }
    );
  })
  .then(user => {
      const token = jwt.sign({ userId: user.id }, secret); // adding token generation
      res.status(201).json({ ...user, token });
  })
  .catch(err => {
      console.error(err);
      res.status(500).end();
  });
}

function list(req, res) {
    const db = req.app.get('db');
  
    db.users
      .find()
      .then(users => res.status(200).json(users))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
}

function getById(req, res) {
    const db = req.app.get('db');
    console.log("userid");
    db.users
      .findOne(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
}

function getProfile(req, res) {
    const db = req.app.get('db');
  
    db.user_profiles
      .findOne({
        userId: req.params.id,
      })
      .then(profile => res.status(200).json(profile))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
}

function login(req, res) {
  const db = req.app.get('db');
  const { email, password } = req.body;

  db.users
    .findOne(
      {
        email,
      },
      {
        fields: ['id', 'email', 'password'],
      }
    )
    .then(user => {
      if (!user) {
        throw new Error('Invalid email');
      }

      return argon2.verify(user.password, password).then(valid => {
        if (!valid) {
          throw new Error('Incorrect password');
        }

        const token = jwt.sign({ userId: user.id }, secret);
        delete user.password; // remove password hash from returned user object
        res.status(200).json({ ...user, token });
      });
    })
    .catch(err => {
      if (['Invalid username', 'Incorrect password'].includes(err.message)) {
        res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        res.status(500).end();
      }
    });
}

module.exports = {
    create,
    list,
    getById,
    getProfile,
    login
};