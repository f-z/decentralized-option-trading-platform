// Inspired by https://github.com/gugui3z24/MEAN-Stack-With-Angular-2-Tutorial

const mongoose = require('mongoose'); // Node tool for MongoDB
mongoose.Promise = global.Promise; // Configuring Mongoose promises
const Schema = mongoose.Schema; // Importing Mongoose schema
const bcrypt = require('bcrypt-nodejs'); // Importing a native node JS bcrypt library

// Validating function to check e-mail length
let emailLengthChecker = (email) => {
  // Checking if e-mail exists
  if (!email) {
    return false; // Returning error
  } else {
    // Checking the length of e-mail string
    if (email.length < 5 || email.length > 30) {
      return false; // Returning error if not within proper length
    } else {
      return true; // Returning true for valid e-mail
    }
  }
};

// Validating function to check if the e-mail format is valid
let validEmailChecker = (email) => {
  // Checking if e-mail exists
  if (!email) {
    return false; // Returning error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Returning regular expression test results (true or false)
  }
};

// Array of email validators
const emailValidators = [
  // Email length validator
  {
    validator: emailLengthChecker,
    message: 'E-mail must have between 5 and 30 characters!'
  },
  // Email format validator
  {
    validator: validEmailChecker,
    message: 'Email must be valid!'
  }
];

// Validating function to check username length
let usernameLengthChecker = (username) => {
  // Checking if username exists
  if (!username) {
    return false; // Returning error
  } else {
    // Checking length of username string
    if (username.length < 3 || username.length > 15) {
      return false; // Returning error if does not meet length requirement
    } else {
      return true; // Returning true for valid username
    }
  }
};

// Validating function to check if valid username format
let validUsername = (username) => {
  // Checking if username exists
  if (!username) {
    return false; // Returning error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // Returning regular expression test result (true or false)
  }
};

// Array of username validators
const usernameValidators = [
  // Username length validator
  {
    validator: usernameLengthChecker,
    message: 'Username must have between 3 and 15 characters!'
  },
  // Username format validator
  {
    validator: validUsername,
    message: 'Username must not contain any special characters!'
  }
];

// Validating function to check password length
let passwordLengthChecker = (password) => {
  // Checking if password exists
  if (!password) {
    return false; // Returning error
  } else {
    // Checking password length
    if (password.length < 8 || password.length > 35) {
      return false; // Returning error, if password length requirement is not met
    } else {
      return true; // Returning true for valid password
    }
  }
};

// Validating function to check if password format is valid
let validPassword = (password) => {
  // Checking if password exists
  if (!password) {
    return false; // Returning error
  } else {
    // Regular expression to test if password has valid format
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password); // Returning regular expression test result (true or false)
  }
};

// Array of password validators
const passwordValidators = [
  // Password length validator
  {
    validator: passwordLengthChecker,
    message: 'Password must have between 8 and 35 characters!'
  },
  // Password format validator
  {
    validator: validPassword,
    message: 'Password must have at least one uppercase, lowercase, special character, and number characters!'
  }
];

// Defining collection and schema
let User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: usernameValidators
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidators
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  region: {
    type: String,
    required: true
  },
  phone: {
    type: Number
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators
  },
  registrationNumber: {
    type: Number
  }
}, {
    collection: 'users'
  });

// Schema middleware to encrypt password
User.pre('save', function(next) {
  // Ensuring password is new or modified, before applying encryption
  if (!this.isModified('password'))
    return next();

  // Applying encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensuring there are no errors
    this.password = hash; // Applying encryption to password
    next(); // Exiting middleware
  });
});

// Methods to compare password to encrypted password upon login
User.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); // Returning comparison of login password to password in database (true or false)
};

// Exporting module/schema
module.exports = mongoose.model('User', User);
