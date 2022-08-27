import { NextFunction, Request, Response } from 'express'
import { check } from 'express-validator'
import validateResult from '../helpers/validateHelper'
import { Beneficiario } from '../interfaces/get.models'

const validateAfiliacion = [
  check('idUsuarioRadica').exists().not().isEmpty(),
  check('estadoAfiliacion').exists().not().isEmpty(),
  check('idTipoDocumentoCotizante').exists().not().isEmpty(),
  check('identificacionCotizante').exists().not().isEmpty(),
  check('primerNombreCotizante').exists().not().isEmpty(),
  check('primerApellidoCotizante').exists().not().isEmpty(),
  check('fechaNacimientoCotizante').exists().not().isEmpty(),
  check('salarioCotizante').exists().not().isEmpty(),
  check('correoCotizante').exists().not().isEmpty(),
  check('celularCotizante').exists().not().isEmpty(),
  check('direccionCotizante').exists().not().isEmpty(),
  check('idEmpresaCotizante').custom((value, { req }) => {
    if (req.body.idTipoAfiliado === 1 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('idCiudadCotizante').exists().not().isEmpty(),
  check('localidadComuna').exists().not().isEmpty(),
  check('zonaCotizante').exists().not().isEmpty(),
  check('sexoCotizante').exists().not().isEmpty(),
  check('copiaIdentificacionCotizante.url').exists().not().isEmpty(),
  check('copiaContratoCotizante.url').custom((value, { req }) => {
    if (req.body.idTipoAfiliado === 2 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('copiaRutCotizante.url').custom((value, { req }) => {
    if (req.body.idTipoAfiliado === 2 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('epsAnteriorCotizante').custom((value, { req }) => {
    if (req.body.idTipoAfiliacion === 1 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('idTipoAfiliado').exists().not().isEmpty(),
  check('idTipoAfiliacion').exists().not().isEmpty(),
  check('idAfp').exists().not().isEmpty(),
  check('idArl').exists().not().isEmpty(),
  check('idIps').exists().not().isEmpty(),
  check('beneficiarios.*.idParentezcoBeneficiario').custom((value, { req }) => {
    if (req.body.beneficiarios.length > 0 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('beneficiarios.*.identificacionBeneficiario').custom((value, { req }) => {
    if (req.body.beneficiarios.length > 0 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('beneficiarios.*.primerNombreBeneficiario').custom((value, { req }) => {
    if (req.body.beneficiarios.length > 0 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('beneficiarios.*.primerApellidoBeneficiario').custom((value, { req }) => {
    if (req.body.beneficiarios.length > 0 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('beneficiarios.*.fechaNacimientoBeneficiario').custom((value, { req }) => {
    if (req.body.beneficiarios.length > 0 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('beneficiarios.*.copiaIdentificacionBeneficiario.url').custom((value, { req }) => {
    if (req.body.beneficiarios.length > 0 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  check('beneficiarios.*.copiaCartaConyugueBeneficiario.url').custom((value, { req }) => {
    const beneficiario = req.body.beneficiarios.find((beneficiario: Beneficiario) => beneficiario.copiaCartaConyugueBeneficiario?.url === value)
    if (req.body.beneficiarios.length > 0 && beneficiario.idParentezcoBeneficiario === 3 && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

const validateEntidad = [
  check('tipoEntidad').exists().not().isEmpty(),
  check('idTipoDocumento').exists().not().isEmpty(),
  check('nombre').exists().not().isEmpty(),
  check('identificacion').exists().not().isEmpty(),
  check('estado').exists().not().isEmpty(),
  check('telefono').exists().not().isEmpty(),
  check('idCiudad').exists().not().isEmpty(),
  check('correo').exists().not().isEmpty(),
  check('direccion').exists().not().isEmpty(),
  check('idEps').custom((value, { req }) => {
    if (req.params?.tipoEntidad === 'ips' && !value) {
      throw new Error('Invalid value')
    }
    return true
  }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

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

export { validateAfiliacion, validateEntidad, validateUser }
