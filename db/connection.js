const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()
const localConfig = {
  host: process.env.JAWS_HOST,
  user: process.env.JAWS_USER,
  password: process.env.JAWS_PW,
  database: process.env.JAWS_DATABASE,
  port: 3306
}
const connection = process.env.JAWSDB_URL ? mysql.createConnection(process.env.JAWSDB_URL) : mysql.createConnection(localConfig)


connection.connect();
console.log('connected to database')

module.exports = connection;