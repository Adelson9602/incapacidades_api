import app from './app'

// Función anónima autoinvocada, se usa como función principal, algo asi como una función main en java u otro lenguaje tipado
(() => {
  app.listen(app.get('port'))

  console.log('Server listening http://localhost:' + app.get('port'))
})()
