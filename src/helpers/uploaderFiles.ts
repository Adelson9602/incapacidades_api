import { Request, Response } from 'express'
import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import { Adjunto } from '../interfaces/get.models'

const projectId = 'api-asesores-file'
const keyFilename = './src/resources/key_google.json'
const storageG = new Storage({
  projectId,
  keyFilename
})

const dataURLtoFile = async (base64: string, fileName: string):Promise<string> => {
  const [, data] = base64.split(',')
  const buff = Buffer.from(data, 'base64')
  const pathFile = path.join(process.cwd(), 'files', fileName)

  fs.writeFileSync(pathFile, buff)
  return pathFile
}

const bucket = storageG.bucket('api-asesores-bucket')

export const uploadHelper = async (dataFile: Adjunto, req: Request, res: Response):Promise<string> => {
  try {
    const fileName = `${uuidv4()}.pdf`
    const resFile = await dataURLtoFile(`${dataFile.url}`, fileName).then(resFile => resFile).catch(error => {
      throw JSON.stringify({
        message: 'Error al convertir archivo',
        error: error.message,
        completeError: error
      })
    })
    if (resFile) {
      return new Promise<string>((resolve, reject) => {
        const file = fs.readFileSync(resFile)
        const buff = Buffer.from(file)
        const blob = bucket.file(fileName)
        const blobStram = blob.createWriteStream()

        blobStram.on('finish', () => {
          const files = bucket.storage.apiEndpoint
          resolve(`${files}/api-asesores-bucket/${fileName}`)
        })
        blobStram.end(buff)
      })
    } else {
      return JSON.stringify({
        message: 'Sin archivos para subir',
        error: 'Campo file viene vacío',
        completeError: null
      })
    }
  } catch (error: any) {
    throw JSON.stringify(error)
  }
}
