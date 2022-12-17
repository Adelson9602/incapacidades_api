import { Request, Response, Express } from 'express'
import { ResponseFile } from 'interfaces/general.models'

export const uploadFile = (req: Request, res: Response) => {
  const { company, folder } = req.params
  const { typeFile } = req.body

  const files = req.files as Express.Multer.File[]
  if (!files) return res.json({ message: 'No hay archivos por subir' })
  const reqFiles: ResponseFile[] = []
  if (files) {
    const tempCompany = company.replace(/ /g, '_')
    for (let i = 0; i < files.length; i++) {
      console.log(files[i])
      reqFiles.push({
        saved: true,
        nameFile: files[i].originalname,
        typeFile: +typeFile,
        url: `${req.headers.host}/files/${tempCompany}/${folder}/${files[i].filename}`
      })
    }
    res.json(reqFiles)
  }
}
