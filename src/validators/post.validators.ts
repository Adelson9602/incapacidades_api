import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import validateResult from '../helpers/validateHelper'

const validateUser = [
  check('idTipoDocumento').exists().not().isEmpty(),
  check('identificacion').exists().not().isEmpty(),
  check('primerNombre').exists().not().isEmpty(),
  check('segundoNombre').exists().not().isEmpty(),
  check('primerApellido').exists().not().isEmpty(),
  check('segundoApellido').exists().not().isEmpty(),
  check('fechaNacimiento').exists().not().isEmpty(),
  check('sexo').exists().not().isEmpty(),
  check('usuario').exists().not().isEmpty(),
  check('password').exists().not().isEmpty(),
  check('estado').exists().not().isEmpty(),
  check('idPrivilegios').exists().not().isEmpty(),
  check('correo').exists().not().isEmpty(),
  check('celular').exists().not().isEmpty(),
  check('zona').exists().not().isEmpty(),
  check('direccion').exists().not().isEmpty(),
  check('idCiudad').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export { validateUser }
