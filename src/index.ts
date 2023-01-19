import app from './app'
import cron from 'node-cron'
import { createNotifications, executeQuery } from './functions/global.functions'
import { scriptGetBases } from './scriptSQL/auth.scripts'
import { Cliente } from './interfaces/auth.models'

cron.schedule('* * 0 * * *', async () => {
  const query = scriptGetBases()
  const result = await executeQuery<Cliente[]>(query)

  const promesas: any[] = []
  result.forEach(e => {
    promesas.push(createNotifications(e.nombreBase))
  })

  await Promise.all(promesas)
});

// Función anónima autoinvocada, se usa como función principal, algo asi como una función main en java u otro lenguaje tipado
(() => {
  app.listen(app.get('port'))

  console.log('Server listening http://localhost:' + app.get('port'))
})()
