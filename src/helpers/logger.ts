import { createLogger, format, transports } from 'winston'
import fs from 'fs'
import path from 'path'
// console.log(__dirname)
const dir = path.join(process.cwd(), 'errors/')
// Creamos la carpeta errors sí no existe
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const customFormat = format.combine(format.timestamp(), format.printf((info) => {
  return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] - ${info.message}`
}))

const logger = createLogger({
  level: 'info',
  format: customFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
    new transports.File({ filename: `${dir}log_errors.log`, level: 'error' }),
    new transports.File({ filename: `${dir}all_logs.log` })
  ]
})

export default logger
