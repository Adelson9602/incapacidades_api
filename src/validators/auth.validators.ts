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

const validateDocument = [
  check('usuario').exists().isNumeric().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateSendEmail = [
  check('numeroDocumento').exists().isNumeric().not().isEmpty(),
  check('nombres').exists().isString().not().isEmpty(),
  check('email').exists().isEmail().not().isEmpty(),
  check('password').exists().isString().not().isEmpty(),
  check('urlQi').exists().isString().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export { validateAuth, validateDocument, validateSendEmail }
