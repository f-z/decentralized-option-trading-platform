// Azure Cosmos DB setup
process.env.NODE_ENV = 'production';
process.env.databaseUri = 'mongodb://okergo:cLla81osbQVpNCyYPvWge6zLNmjyZjPlasE61j87plBSTXS39B3oCNF23KGl65p5WeRXCQsajOxDe2S8XuLYAA%3D%3D@okergo.documents.azure.com:10255/mean-dev?ssl=true&sslverifycertificate=false'; // Production database URI
process.env.databaseName = 'okergo'; // Production database name

// Localhost/dual setup
// const fs = require('fs');

// if (fs.existsSync('./public')) {
// ...
// } else {
//  process.env.NODE_ENV = 'development';
//  process.env.databaseUri = 'mongodb://localhost:27018/'; // Production database URI
//  process.env.databaseName = 'development database: okergo'; // Production database name
// }
