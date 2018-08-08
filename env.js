// Azure Cosmos DB setup
// process.env.NODE_ENV = 'production';
// process.env.databaseUri = 'mongodb://okergo:fh1MheBPZxgrDVDORvUtE2sldaZZCJuaGJdH0CzZbhvZjTMIab6O2XiE26CJJVG1AZH30WZn3e0AZz9sIoZ4Tg%3D%3D@okergo.documents.azure.com:10255/?ssl=true&replicaSet=globaldb'; // Production database URI
// process.env.databaseName = 'okergo'; // Production database name

// Localhost/dual setup
// const fs = require('fs');

// if (fs.existsSync('./public')) {
// ...
// } else {
process.env.NODE_ENV = 'development';
process.env.databaseUri = 'mongodb://localhost:27018/'; // Production database URI
process.env.databaseName = 'development database: smart options system'; // Production database name
// }
