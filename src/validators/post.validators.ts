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
  // check('correo').exists().not().isEmpty().isEmail(),
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
  // check('idContacto').exists().not().isEmpty(),
  check('direccion').exists().not().isEmpty(),
  check('barrio').exists().not().isEmpty(),
  check('correo').exists().not().isEmpty().isEmail(),
  check('celular').exists().not().isEmpty(),
  check('telefonoFijo').exists().not().isEmpty(),
  check('fkIdCiudad').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateDisabilityType = [
  check('nombreTipoIncapacidad').exists().not().isEmpty(),
  check('codigoDianostico').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validatePosition = [
  check('idCargo').exists(),
  check('nombreCargo').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validatePerson = [
  check('documentoPersona').exists().not().isEmpty(),
  check('fkIdTipoDocumento').exists().not().isEmpty(),
  check('primerNombre').exists().not().isEmpty(),
  check('primerApellido').exists().not().isEmpty(),
  check('fechaNacimiento').exists().not().isEmpty(),
  check('genero').exists().not().isEmpty(),
  check('idContacto').exists(),
  check('direccion').exists().not().isEmpty(),
  check('barrio').exists().not().isEmpty(),
  check('correo').exists().not().isEmpty().isEmail(),
  check('celular').exists().not().isEmpty(),
  check('telefonoFijo').exists().not().isEmpty(),
  check('fkIdCiudad').exists().not().isEmpty(),
  check('fkDocumentoPersona').custom((value, { req }) => {
    const { isEmploye } = req.body
    if (isEmploye && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('fkIdCargo').custom((value, { req }) => {
    const { isEmploye } = req.body
    if (isEmploye && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export {
  validateUser,
  validateTypeCp,
  validateCompany,
  validateDisabilityType,
  validatePerson,
  validatePosition
}
