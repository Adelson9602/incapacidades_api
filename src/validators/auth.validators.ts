import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import validateResult from '../helpers/validateHelper'

const validateAuth = [
  check('usuario').exists().isNumeric().not().isEmpty(),
  check('password').exists().isString().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export { validateAuth }
