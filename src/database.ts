import mysql from 'mysql'
// The method createConnection receive one object how parameter with the settings for connect to the db

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'incapacidades',
  multipleStatements: true
})

db.connect((err) => {
  console.log('****************************')
  console.log('******** INICIANDO *********')
  console.log('****************************')
  if (err) {
    console.log('****************************')
    console.log('*********  EERROR  *********')
    console.log('****************************')
    console.log(err.message)
    console.log(err)
    throw err
  } else {
    console.log('****************************')
    console.log('******** CONECTADO *********')
    console.log('****************************')
  }
})

export default db
