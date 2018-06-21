const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://patel:patel@ds153752.mlab.com:53752/angular-2-app'; // Production database URI
  process.env.databaseName = 'production database: okergo'; // Production database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://localhost:27018/'; // Production database URI
  process.env.databaseName = 'development database: okergo'; // Production database name
}