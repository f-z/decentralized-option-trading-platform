const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let User = new Schema({
  term: {
    type: String
  },
  date: {
    type: Number
  },
  count: {
    type: Number
  }
}, {
    collection: 'users'
  });

module.exports = mongoose.model('User', User);
