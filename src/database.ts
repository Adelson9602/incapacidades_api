import mysql from 'mysql'
// The method createConnection receive one object how parameter with the settings for connect to the db

const db = mysql.createConnection({
  host: '68.183.138.221',
  user: 'developer',
  password: 'Developer2022*',
  database: 'clientes',
  multipleStatements: true
})

db.connect((err) => {
  if (err) {
    console.log('*********  EERROR  *********')
    console.log(err.message)
    console.log(err)
    throw err
  } else {
    console.log('******** CONECTADO *********')
  }
})

export default db
