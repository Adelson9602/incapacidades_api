import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import validateResult from '../helpers/validateHelper'

const validateUser = [
  check('documentoPersona').exists().not().isEmpty(),
  check('fkIdTipoDocumento').exists().not().isEmpty(),
  check('primerNombre').exists().not().isEmpty().toUpperCase(),
  check('primerApellido').exists().not().isEmpty().toUpperCase(),
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
  check('idTipoEmpresa').exists(),
  check('nombreTipoEmpresa').exists().not().isEmpty().toUpperCase(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateCompany = [
  check('nit').exists().not().isEmpty(),
  check('razonSocial').exists().not().isEmpty().toUpperCase(),
  check('fkIdTipoEmpresa').exists().not().isEmpty(),
  check('idContacto').exists(),
  check('direccion').exists().not().isEmpty().toUpperCase(),
  check('barrio').exists().not().isEmpty().toUpperCase(),
  check('correo').exists().not().isEmpty().isEmail().toUpperCase(),
  check('celular').exists().not().isEmpty(),
  check('telefonoFijo').exists().not().isEmpty(),
  check('fkIdCiudad').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateDisabilityType = [
  check('nombreTipoIncapacidad').exists().not().isEmpty().toUpperCase(),
  check('codigoDianostico').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateDisabilityState = [
  check('nombreEstadoIncapacidad').exists().not().isEmpty().toUpperCase(),
  check('idEstadoIncapacidad').exists(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validatePosition = [
  check('idCargo').exists(),
  check('nombreCargo').exists().not().isEmpty().toUpperCase().toUpperCase(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateDeparment = [
  check('idDepartamento').exists(),
  check('nombreDepartamento').exists().not().isEmpty().toUpperCase(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateCity = [
  check('idCiudad').exists(),
  check('nombreCiudad').exists().not().isEmpty().toUpperCase(),
  check('fkIdDepartamento').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateDisability = [
  check('radicado').exists(),
  check('fkIdTipoIncapacidad').exists().not().isEmpty(),
  check('fkNitEmpresa').exists().not().isEmpty(),
  check('numeroIncapacidad').exists().not().isEmpty(),
  check('fechaInicio').exists().not().isEmpty(),
  check('fechaFin').exists().not().isEmpty(),
  check('totalDias').exists().not().isEmpty(),
  check('ibc').exists().not().isEmpty(),
  check('valor').exists().not().isEmpty(),
  check('fkIdEstadoIncapacidad').exists().not().isEmpty(),
  check('fkDocumentoPersona').exists().not().isEmpty(),
  check('fkEntidad').exists().not().isEmpty(),
  check('cie').exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateHistoryDisability = [
  check('idHistorialIncapacidad').exists(),
  check('fkIdIncapacidad').exists().not().isEmpty(),
  check('fechaIniciaProrroga').exists().not().isEmpty(),
  check('fechaFinProrroga').exists().not().isEmpty(),
  check('diasProrroga').exists().not().isEmpty(),
  check('valor').exists().not().isEmpty(),
  check('usuario').exists().not().isEmpty(),
  check('observacion').exists().not().isEmpty().toUpperCase(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateRol = [
  check('idRol').exists(),
  check('nombreRol').exists().not().isEmpty().toUpperCase(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateTypeDocument = [
  check('idTipoDocumento').exists(),
  check('nombreTipoDocumento').exists().not().isEmpty().toUpperCase(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validatePerson = [
  check('documentoPersona').exists().not().isEmpty(),
  check('fkIdTipoDocumento').exists().not().isEmpty(),
  check('primerNombre').exists().not().isEmpty().toUpperCase(),
  check('primerApellido').exists().not().isEmpty().toUpperCase(),
  check('fechaNacimiento').exists().not().isEmpty(),
  check('genero').exists().not().isEmpty().toUpperCase(),
  check('idContacto').exists(),
  check('direccion').exists().not().isEmpty().toUpperCase(),
  check('barrio').exists().not().isEmpty().toUpperCase(),
  check('correo').exists().not().isEmpty().isEmail().toUpperCase(),
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
  validateDisabilityState,
  validatePerson,
  validatePosition,
  validateDisability,
  validateHistoryDisability,
  validateRol,
  validateTypeDocument,
  validateDeparment,
  validateCity
}
