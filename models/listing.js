/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node tool for MongoDB
mongoose.Promise = global.Promise; // Configuring mongoose promises
const Schema = mongoose.Schema; // Importing schema from mongoose

// Validating function to check listing title length
let titleLengthChecker = (title) => {
  // Checking if listing title exists
  if (!title) {
    return false; // Returning error
  } else {
    // Checking the length of title
    if (title.length < 5 || title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validating function to check if title format is valid
let alphaNumericTitleChecker = (title) => {
  // Checking if title exists
  if (!title) {
    return false; // Returning error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title); // Returning regular expression test results (true or false)
  }
};

// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be more than 5 characters but no more than 50'
  },
  // Second Title Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Title must be alphanumeric'
  }
];

// Validate Function to check body length
let bodyLengthChecker = (body) => {
  // Check if body exists
  if (!body) {
    return false; // Return error
  } else {
    // Check length of body
    if (body.length < 5 || body.length > 500) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

// Array of Body validators
const bodyValidators = [
  // First Body validator
  {
    validator: bodyLengthChecker,
    message: 'Body must be more than 5 characters but no more than 500.'
  }
];

// Validate Function to check comment length
let commentLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return comment as valid
    }
  }
};

// Array of Comment validators
const commentValidators = [
  // First comment validator
  {
    validator: commentLengthChecker,
    message: 'Comments may not exceed 200 characters.'
  }
];

// Listing model definition
const listingSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  body: { type: String, required: true, validate: bodyValidators },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: Array },
  comments: [{
    comment: { type: String, validate: commentValidators },
    commentator: { type: String }
  }]
});

// Exporting module/schema
module.exports = mongoose.model('Listing', listingSchema);
