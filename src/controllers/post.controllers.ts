import { Request, Response } from 'express'
import httpError from '../helpers/handleError'
import { executeQuery } from '../functions/global.functions'
import { scriptCreatePerson } from '../scriptSQL/post.scripts'

export const insertUser = async (req: Request, res: Response) => {
  try {
    const script = scriptCreatePerson(req.body)
    const result = await executeQuery(script, true)
    res.json(result)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
