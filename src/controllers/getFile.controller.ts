import { Request, Response } from 'express'
import fs from 'fs'

export const getFile = (req: Request, res: Response) => {
  if (!req.params.destino) {
    res.status(400).json({
      message: 'Parametro destino, NO definido',
      ok: false
    })
    return
  }

  const folder = `adjuntos/${req.params.destino}/`

  fs.readdir(folder, (_, files) => {
    res.json({
      ok: true,
      url: files
    })
  })
}
