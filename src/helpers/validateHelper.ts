import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import httpError from '../helpers/handleError'

const validateResult = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw()
    return next()
  } catch (error: any) {
    httpError(res, req, JSON.stringify({ message: 'Campos vacíos', error: error.array() }), 403)
  }
}

export default validateResult
