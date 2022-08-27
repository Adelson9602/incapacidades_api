import fs from 'fs'
import { Request, Response } from 'express'

const DIR = './adjuntos/' // Almacenará los adjuntos en esta ruta

export const deleteFile = (req: Request, res: Response) => {
  const { company, folder, fileName } = req.params
  fs.unlink(`${DIR}${company}/${folder}/${fileName}`, err => {
    if (err) {
      return res.json({
        ok: false,
        message: err
      })
    }
    return res.json({
      ok: true,
      message: 'Arvhivo eliminado'
    })
  })
}
