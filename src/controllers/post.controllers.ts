import { Request, Response } from 'express'
import db from '../database'
import httpError from '../helpers/handleError'

export const insertUser = async (req: Request, res: Response) => {
  try {
    console.log(db)
  } catch (error: any) {
    httpError(res, req, error, 400)
  }
}
