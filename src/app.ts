import express from 'express'
import morgan from 'morgan'
import pkg from '../package.json'
import swaggerUi from 'swagger-ui-express'
import swaggerSettup from './docs/swagger'
import cors from 'cors'

// rutas de la api
import routes from './routes'

const app = express()
app.set('trust proxy', true)
app.set('port', 9090)

app.set('pkg', pkg)

app.use(morgan('dev'))
app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.use('/adjuntos', express.static('adjuntos'))

// Ruta index
app.get('/', (_, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version
  })
})
// Ruta para la documentación de la api
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSettup))

// Rutas de la api
app.use(routes)

export default app
