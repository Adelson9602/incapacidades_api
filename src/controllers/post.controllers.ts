import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import { executeQuery } from '../functions/global.functions'
import { sccriptCreateUser, scriptCreatePerson } from '../scriptSQL/post.scripts'
import { ResultSql } from '../interfaces/get.models'

export const insertUser = async (req: Request, res: Response) => {
  try {
    const script = scriptCreatePerson(req.body)
    const result = await executeQuery<ResultSql>(script, true).then(() => {
      const query = sccriptCreateUser(req.body)
      return executeQuery<ResultSql>(query, true)
    })
    res.json({
      message: 'Datos guardados',
      data: result
    })
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
