const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions)

// Exporting config object
module.exports = {
  uri: process.env.databaseUri, // Database URI
  secret: crypto, // Cryto-created secret
  db: process.env.databaseName // Database name
}