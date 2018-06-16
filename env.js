const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://patel:patel@ds153752.mlab.com:53752/angular-2-app'; // Database URI
  process.env.databaseName = 'production database: okergo'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://localhost:27018/'; // Database URI
  process.env.databaseName = 'development database: okergo'; // Database name
}