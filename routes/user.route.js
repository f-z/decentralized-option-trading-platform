const express = require('express');
const app = express();
const userRoutes = express.Router();

// Requiring User model
let User = require('../models/User');

// Defining store route
userRoutes.route('/add').post(function (req, res) {
  let user = new User(req.body);
  user.save()
    .then(game => {
      res.status(200).json({ 'user': 'User added successfully' });
    })
    .catch(err => {
      res.status(400).send("Unable to register");
    });
});

// Defining get all data route
userRoutes.route('/').get(function (req, res) {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(users);
    }
  });
});

// Defining get user route
userRoutes.route('/get/:username').get(function (req, res) {
  let username = req.params.username;
  User.findById(username, function (err, user) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(user);
    }
  });
});

// Defining edit route
userRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  User.findById(id, function (err, user) {
    res.json(user);
  });
});

//  Defining update route
userRoutes.route('/update/:id').post(function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (!user)
      return next(new Error('Could not load document'));
    else {
      user.term = req.body.term;
      user.date = req.body.date;
      user.count = req.body.term;

      user.save().then(user => {
        res.json('Update complete');
      })
        .catch(err => {
          res.status(400).send("Unable to update database");
        });
    }
  });
});

// Defined delete | remove | destroy route
userRoutes.route('/delete/:id').get(function (req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = userRoutes;
