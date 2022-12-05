import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Guarda el archivo base64 en el disco
// const dataURLtoFile = async (base64: string, fileName: string):Promise<string> => {
//   const [, data] = base64.split(',')
//   const buff = Buffer.from(data, 'base64')
//   const pathFile = path.join(process.cwd(), 'files', fileName)

//   fs.writeFileSync(pathFile, buff)
//   return pathFile
// }

const dirRoot = path.join(process.cwd(), 'files')

const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    const { company, folder } = req.params

    const tempCompany = company.replace(/ /g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const dirFile = path.join(dirRoot, `${tempCompany}/${folder}/`)
    // Creamos la carpeta donde se guardaran los archivos, solo si no existe
    if (!fs.existsSync(dirFile)) fs.mkdirSync(dirFile, { recursive: true })

    cb(null, dirFile)
  },
  filename: (_, file, cb) => {
    // uuidv4 permite generar un id en string que se usara como nombre del archivo
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})

export default multer({
  storage
}).array('files', 10)
