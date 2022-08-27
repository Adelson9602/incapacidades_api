import express from 'express'
import fs from 'fs'

// Cargamos las rutas de forma dinámica
const router = express.Router()
const pathRouter = `${__dirname}`
const messageError = {
  message: 'Ruta no encontrada',
  error: 'La ruta no esta dinponible o no existe'
}

const removeExtension = (fileName: string):string => {
  return fileName.split('.').shift() || ''
}
fs.readdirSync(pathRouter).forEach(file => {
  const fileNotExtension = removeExtension(file)
  const skip = ['index'].includes(fileNotExtension)
  if (!skip) {
    router.use(require(`./${file}`))
  }
})

router.get('*', (_, res) => {
  res.status(404).json(messageError)
})

router.post('*', (_, res) => {
  res.status(404).json(messageError)
})

export default router
