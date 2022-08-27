import { Request, Response } from 'express'
import { Storage } from '@google-cloud/storage'
import httpError from '../helpers/handleError'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

const projectId = 'api-asesores-file'
const keyFilename = './src/resources/key_google.json'
const storageG = new Storage({
  projectId,
  keyFilename
})

const bucket = storageG.bucket('api-asesores-bucket')

const dataURLtoFile = async (base64: string, fileName: string) => {
  const [, data] = base64.split(',')
  const buff = Buffer.from(data, 'base64')
  const pathFile = path.join(process.cwd(), 'files', fileName)

  fs.writeFileSync(pathFile, buff)
  return pathFile
}

// from base64
export const uploadFileFromBase64 = (req: Request, res: Response) => {
  try {
    const { copiaIdentificacionCotizante } = req.body
    const fileName = `${uuidv4()}.pdf`
    dataURLtoFile(copiaIdentificacionCotizante.url, fileName).then(resFile => {
      if (resFile) {
        const file = fs.readFileSync(resFile)
        const buff = Buffer.from(file)
        const blob = bucket.file(fileName)
        const blobStram = blob.createWriteStream()

        blobStram.on('finish', () => {
          const files = bucket.storage.apiEndpoint
          res.json({
            message: 'Archivo cargado',
            url: `${files}/api-asesores-bucket/${fileName}`
          })
        })
        blobStram.end(buff)
      } else {
        throw JSON.stringify({
          message: 'Sin archivos para subir',
          error: 'Campo file viene vacío'
        })
      }
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}

export const uploadFile = (req: Request, res: Response) => {
  try {
    const { file } = req
    const { idPersona, tipoFile } = req.body
    const fileName = `${uuidv4()}.pdf`
    if (file) {
      const blob = bucket.file(fileName)
      const blobStram = blob.createWriteStream()

      blobStram.on('finish', () => {
        const files = bucket.storage.apiEndpoint
        res.json({
          message: 'Archivo cargado',
          url: `${files}/api-asesores-bucket/${fileName}`,
          idPersona,
          tipoFile: Number(tipoFile) || null
        })
      })
      blobStram.end(file.buffer)
    } else {
      throw JSON.stringify({
        message: 'Sin archivos para subir',
        error: 'Campo file viene vacío'
      })
    }
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
