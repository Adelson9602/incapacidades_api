import { Request, Response } from 'express'
import { executeQuery } from '../functions/global.functions'
import httpError from '../helpers/handleError'
import { ResultSql } from '../interfaces/general.models'
import { scriptUpdateStatusDisability } from '../scriptSQL/put.scripts'

export const putChangeStateDisability = async (req: Request, res: Response) => {
  try {
    const base: string = req.headers.base as string
    const { estado, idIncapacidad } = req.body
    const query = scriptUpdateStatusDisability(base, idIncapacidad, estado)
    const result = await executeQuery<ResultSql>(query)
    res.status(200).json({
      message: 'Estado actualizdo',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, JSON.stringify({
      message: error.message,
      completeError: error
    }), 400)
  }
}
