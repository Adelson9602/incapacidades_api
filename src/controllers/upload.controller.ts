import { Request, Response, Express } from 'express'
import { ResponseFile } from 'interfaces/general.models'

export const uploadFile = (req: Request, res: Response) => {
  const { company, folder } = req.params
  const { typeFile, fkRadicado } = req.body
  console.log(typeFile)

  const files = req.files as Express.Multer.File[]
  if (!files) return res.json({ message: 'No hay archivos por subir' })
  const reqFiles: ResponseFile[] = []
  if (files) {
    const tempCompany = company.replace(/ /g, '_')
    for (let i = 0; i < files.length; i++) {
      reqFiles.push({
        saved: true,
        typeFile: +typeFile,
        url: `${req.headers.host}/files/${tempCompany}/${folder}/${files[i].filename}`
      })
    }
    if (reqFiles.length > 1) {
      res.json(reqFiles)
    } else {
      res.json({
        saved: true,
        typeFile: +typeFile,
        url: reqFiles[0]
      })
    }
  }
}
