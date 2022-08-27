import mysql from 'mysql'
// The method createConnection receive one object how parameter with the settings for connect to the db

const db = mysql.createConnection({
  host: '162.243.174.93',
  user: 'remoto',
  password: 'Produccion2022@',
  database: 'asesores_integrales',
  multipleStatements: true
  // HEROKU
  // host: 'us-cdbr-east-06.cleardb.net',
  // user: 'bcd06649b4628e',
  // password: 'f33ddf6f',
  // database: 'heroku_0eca0ac55deaf70'
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
