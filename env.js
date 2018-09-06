// Localhost/dual setup
// const fs = require('fs');

// if (fs.existsSync('./public')) {
// ...
// } else {
process.env.NODE_ENV = 'development';
process.env.databaseUri = 'mongodb://localhost:27018/'; // Production database URI
process.env.databaseName = 'development database: option trading platform'; // Production database name
// }