const sql = require('mssql');
 
const config = {
  user: 'manasa',
  password: 'Manasa@123',
  server: 'localhost', // Or 'localhost\\SQLEXPRESS'
  database: 'MIRCHI',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
 
const connect = async () => {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('DB connection failed:', err);
    throw err;
  }
};
 
module.exports = {
  connect,
  sql,
};