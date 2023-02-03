import fs from 'fs'
import { Request, Response } from 'express'
import { scriptDeleteDisability } from '../scriptSQL/delete.scripts'
import { executeQuery } from '../functions/global.functions'
import httpError from '../helpers/handleError'
import { ResultSql } from 'interfaces/general.models'

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

export const deleteDisability = async (req: Request, res: Response) => {
  try {
    const base:string = req.headers.base as string
    const { numeroIncapacidad } = req.params
    const query = scriptDeleteDisability(base, +numeroIncapacidad)
    await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Incapacidad eliminada'
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: 'Error al eliminar incapacidad',
      error: error.message,
      completeError: error
    }), 400)
  }
}
