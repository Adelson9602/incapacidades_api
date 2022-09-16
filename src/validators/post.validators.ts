import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import validateResult from '../helpers/validateHelper'

const validateUser = [
  check('documentoPersona').exists().not().isEmpty(),
  check('fkIdTipoDocumento').exists().not().isEmpty(),
  check('primerNombre').exists().not().isEmpty(),
  check('primerApellido').exists().not().isEmpty(),
  check('fechaNacimiento').exists().not().isEmpty(),
  check('genero').exists().not().isEmpty(),
  // check('usuario').exists().not().isEmpty(),
  // check('password').exists().not().isEmpty(),
  // check('estado').exists().not().isEmpty(),
  // check('idPrivilegios').exists().not().isEmpty(),
  // check('correo').exists().not().isEmpty(),
  // check('celular').exists().not().isEmpty(),
  // check('zona').exists().not().isEmpty(),
  // check('direccion').exists().not().isEmpty(),
  // check('idCiudad').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateTypeCp = [
  check('nombreTipoEmpresa').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateCompany = [
  check('nit').exists().not().isEmpty(),
  check('razonSocial').exists().not().isEmpty(),
  check('fkIdTipoEmpresa').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export { validateUser, validateTypeCp, validateCompany }
